// Utility functions for dynamic group management

const MAX_TEAMS_PER_GROUP = 4;

/**
 * Calculate the number of groups needed based on team count
 */
export function getRequiredGroupCount(teamCount: number): number {
  if (teamCount === 0) return 1;
  return Math.ceil(teamCount / MAX_TEAMS_PER_GROUP);
}

/**
 * Generate available group letters based on team count
 * Returns array like ['A', 'B'] or ['A', 'B', 'C', 'D'] etc.
 */
export function getAvailableGroups(teamCount: number): string[] {
  const groupCount = getRequiredGroupCount(teamCount);
  return Array.from({ length: groupCount }, (_, i) => String.fromCharCode(65 + i));
}

/**
 * Get all unique groups currently in use by teams
 */
export function getExistingGroups(teams: { group_name: string }[]): string[] {
  const groups = new Set(teams.map(t => t.group_name));
  return Array.from(groups).sort();
}

/**
 * Get groups that should be displayed (union of required groups and existing groups)
 */
export function getDisplayGroups(teams: { group_name: string }[]): string[] {
  const teamCount = teams.length;
  const requiredGroups = getAvailableGroups(teamCount);
  const existingGroups = getExistingGroups(teams);
  
  // Merge required and existing groups
  const allGroups = new Set([...requiredGroups, ...existingGroups]);
  return Array.from(allGroups).sort();
}

/**
 * Check if a group is full (has MAX_TEAMS_PER_GROUP or more teams)
 */
export function isGroupFull(groupName: string, teams: { group_name: string }[]): boolean {
  const teamsInGroup = teams.filter(t => t.group_name === groupName).length;
  return teamsInGroup >= MAX_TEAMS_PER_GROUP;
}

/**
 * Get a suggested group for a new team (first non-full group)
 */
export function getSuggestedGroup(teams: { group_name: string }[]): string {
  const groups = getDisplayGroups(teams);
  
  for (const group of groups) {
    if (!isGroupFull(group, teams)) {
      return group;
    }
  }
  
  // All groups are full, suggest next letter
  const lastGroup = groups[groups.length - 1] || 'A';
  const nextGroupCode = lastGroup.charCodeAt(0) + 1;
  return String.fromCharCode(nextGroupCode);
}

/**
 * Get available groups for selection (including next available if all are full)
 */
export function getSelectableGroups(teams: { group_name: string }[], currentTeamId?: string): string[] {
  // Filter out current team when checking
  const otherTeams = currentTeamId 
    ? teams.filter(t => (t as any).id !== currentTeamId)
    : teams;
  
  const groups = getDisplayGroups(otherTeams);
  
  // Check if we need to add another group option
  const allFull = groups.every(g => isGroupFull(g, otherTeams));
  
  if (allFull && groups.length < 26) {
    const lastGroup = groups[groups.length - 1] || '@'; // '@' is before 'A'
    const nextGroupCode = lastGroup.charCodeAt(0) + 1;
    groups.push(String.fromCharCode(nextGroupCode));
  }
  
  // Always show at least A
  if (groups.length === 0) {
    return ['A'];
  }
  
  return groups;
}

export { MAX_TEAMS_PER_GROUP };
