// Optimal bucket/group assignment algorithm for balanced leaderboards

export interface BucketConfiguration {
  total_teams: number;
  buckets: number;
  teams_per_bucket: number;
  balanced: boolean;
  note?: string;
}

/**
 * Check if a number is prime
 */
function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * Get all factor pairs of a number
 * Returns array of [buckets, teams_per_bucket] pairs
 */
function getFactorPairs(n: number): [number, number][] {
  const pairs: [number, number][] = [];
  const sqrt = Math.sqrt(n);
  
  for (let i = 1; i <= sqrt; i++) {
    if (n % i === 0) {
      pairs.push([i, n / i]);
      if (i !== n / i) {
        pairs.push([n / i, i]);
      }
    }
  }
  
  return pairs.sort((a, b) => a[0] - b[0]);
}

/**
 * Calculate optimal bucket configuration using factorization
 * Prefers configurations where buckets ≈ √total_teams
 */
export function calculateOptimalBuckets(totalTeams: number): BucketConfiguration {
  // Edge case: 0 or 1 team
  if (totalTeams <= 1) {
    return {
      total_teams: totalTeams,
      buckets: 1,
      teams_per_bucket: totalTeams,
      balanced: true,
      note: totalTeams === 0 ? "No teams to distribute" : "Single team"
    };
  }

  // Check if prime - can only have 1 bucket
  if (isPrime(totalTeams)) {
    return {
      total_teams: totalTeams,
      buckets: 1,
      teams_per_bucket: totalTeams,
      balanced: true,
      note: "Equal division not possible (prime number)"
    };
  }

  // Get all factor pairs
  const pairs = getFactorPairs(totalTeams);
  
  // Filter out (1, n) and (n, 1) to prefer multiple balanced buckets
  const validPairs = pairs.filter(([buckets]) => buckets > 1 && buckets < totalTeams);
  
  if (validPairs.length === 0) {
    // Only (1, n) available - use it
    return {
      total_teams: totalTeams,
      buckets: 1,
      teams_per_bucket: totalTeams,
      balanced: true,
      note: "Single bucket (no valid factor pairs)"
    };
  }

  // Find the pair where buckets is closest to √totalTeams
  const sqrtTarget = Math.sqrt(totalTeams);
  
  let bestPair = validPairs[0];
  let bestDistance = Math.abs(validPairs[0][0] - sqrtTarget);
  
  for (const pair of validPairs) {
    const distance = Math.abs(pair[0] - sqrtTarget);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestPair = pair;
    }
  }

  return {
    total_teams: totalTeams,
    buckets: bestPair[0],
    teams_per_bucket: bestPair[1],
    balanced: true
  };
}

/**
 * Distribute teams into balanced buckets automatically
 * Teams are sorted by points (descending) and distributed in snake-draft order for fairness
 */
export function distributeTeamsIntoBuckets<T extends { points: number; id: string }>(
  teams: T[],
  config: BucketConfiguration
): Map<string, T[]> {
  const buckets = new Map<string, T[]>();
  
  // Initialize buckets with letter names (A, B, C, etc.)
  for (let i = 0; i < config.buckets; i++) {
    const bucketName = String.fromCharCode(65 + i);
    buckets.set(bucketName, []);
  }

  if (teams.length === 0) {
    return buckets;
  }

  // Sort teams by points (descending) for fair distribution
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  
  // Snake-draft distribution for fairness
  // Round 1: A, B, C, D
  // Round 2: D, C, B, A
  // Round 3: A, B, C, D
  // etc.
  const bucketNames = Array.from(buckets.keys());
  let forward = true;
  let bucketIndex = 0;

  for (const team of sortedTeams) {
    const bucketName = bucketNames[bucketIndex];
    buckets.get(bucketName)!.push(team);

    // Move to next bucket
    if (forward) {
      bucketIndex++;
      if (bucketIndex >= config.buckets) {
        bucketIndex = config.buckets - 1;
        forward = false;
      }
    } else {
      bucketIndex--;
      if (bucketIndex < 0) {
        bucketIndex = 0;
        forward = true;
      }
    }
  }

  return buckets;
}

/**
 * Get bucket assignment for display purposes
 * Returns a mapping of team ID to bucket letter
 */
export function getTeamBucketAssignments<T extends { points: number; id: string }>(
  teams: T[]
): Map<string, string> {
  const config = calculateOptimalBuckets(teams.length);
  const buckets = distributeTeamsIntoBuckets(teams, config);
  
  const assignments = new Map<string, string>();
  
  for (const [bucketName, bucketTeams] of buckets) {
    for (const team of bucketTeams) {
      assignments.set(team.id, bucketName);
    }
  }
  
  return assignments;
}

/**
 * Get display-ready bucket data with teams
 */
export function getBucketDisplay<T extends { points: number; id: string }>(
  teams: T[]
): { config: BucketConfiguration; buckets: Map<string, T[]> } {
  const config = calculateOptimalBuckets(teams.length);
  const buckets = distributeTeamsIntoBuckets(teams, config);
  
  return { config, buckets };
}

/**
 * Get available bucket letters for the current configuration
 */
export function getAvailableBuckets(teamCount: number): string[] {
  const config = calculateOptimalBuckets(teamCount);
  return Array.from({ length: config.buckets }, (_, i) => String.fromCharCode(65 + i));
}

// Legacy exports for backwards compatibility - deprecated
export const MAX_TEAMS_PER_GROUP = 4;

export function getRequiredGroupCount(teamCount: number): number {
  return calculateOptimalBuckets(teamCount).buckets;
}

export function getAvailableGroups(teamCount: number): string[] {
  return getAvailableBuckets(teamCount);
}

export function getExistingGroups(teams: { group_name: string }[]): string[] {
  const groups = new Set(teams.map(t => t.group_name));
  return Array.from(groups).sort();
}

export function getDisplayGroups(teams: { group_name: string }[]): string[] {
  return getAvailableBuckets(teams.length);
}

export function isGroupFull(groupName: string, teams: { group_name: string }[]): boolean {
  const config = calculateOptimalBuckets(teams.length);
  const teamsInGroup = teams.filter(t => t.group_name === groupName).length;
  return teamsInGroup >= config.teams_per_bucket;
}

export function getSuggestedGroup(teams: { group_name: string }[]): string {
  return "A"; // Auto-assignment handles this now
}

export function getSelectableGroups(teams: { group_name: string }[], currentTeamId?: string): string[] {
  const otherTeams = currentTeamId 
    ? teams.filter(t => (t as any).id !== currentTeamId)
    : teams;
  return getAvailableBuckets(otherTeams.length + 1);
}
