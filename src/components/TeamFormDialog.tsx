import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gamepad2, Save, Plus } from "lucide-react";

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required").max(50, "Team name too long"),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  wins: z.coerce.number().min(0, "Cannot be negative"),
  losses: z.coerce.number().min(0, "Cannot be negative"),
  points: z.coerce.number().min(0, "Cannot be negative"),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  wins: number;
  losses: number;
  points: number;
}

interface TeamFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team?: Team | null;
  onSubmit: (data: TeamFormData & { id?: string }) => void;
}

export function TeamFormDialog({
  open,
  onOpenChange,
  team,
  onSubmit,
}: TeamFormDialogProps) {
  const isEditing = !!team;

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      logo_url: "",
      wins: 0,
      losses: 0,
      points: 0,
    },
  });

  useEffect(() => {
    if (team) {
      form.reset({
        name: team.name,
        logo_url: team.logo_url || "",
        wins: team.wins,
        losses: team.losses,
        points: team.points,
      });
    } else {
      form.reset({
        name: "",
        logo_url: "",
        wins: 0,
        losses: 0,
        points: 0,
      });
    }
  }, [team, form]);

  const handleSubmit = (data: TeamFormData) => {
    onSubmit({
      ...data,
      logo_url: data.logo_url || undefined,
      id: team?.id,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border border-glow-red sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-wider flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            {isEditing ? "Edit Team" : "Add New Team"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                    Team Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter team name"
                      className="bg-secondary border-border focus:border-primary font-body"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                    Logo URL (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/logo.png"
                      className="bg-secondary border-border focus:border-primary font-body"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="wins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-display text-xs uppercase tracking-widest text-neon-cyan">
                      Wins
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        className="bg-secondary border-border focus:border-neon-cyan font-display text-center text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="losses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-display text-xs uppercase tracking-widest text-destructive">
                      Losses
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        className="bg-secondary border-border focus:border-destructive font-display text-center text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-display text-xs uppercase tracking-widest text-primary">
                      Points
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        className="bg-secondary border-border focus:border-primary font-display text-center text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="font-display uppercase tracking-wider"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 font-display uppercase tracking-wider clip-angle-sm"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Team
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
