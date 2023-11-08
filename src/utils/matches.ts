import path from "path";
import Resolver from "arc-resolver";
import {
  type FlagSet,
  compareFlaggedObject,
  hasFlagSet,
  normalizeFlagSet,
} from "./flags";

export type Matches = { default: string; alternates: [Match, ...Match[]] };
export type Match = { flags: FlagSet; value: string };

type RawMatch = { flags: string[]; value: string };

const resolver = new Resolver();
const hasQuery = /\?.*$/;
export function getMatches(
  id: string,
  flagSets: FlagSet[],
): Matches | undefined {
  if (hasQuery.test(id) || !path.isAbsolute(id)) return;

  const raw = tryGetRawMatches(id);
  if (!raw) return;

  let i = raw.length - 1;
  if (i) {
    const defaultMatch = raw[i].value;
    let alternates: undefined | [Match, ...Match[]];
    for (; i--; ) {
      const match = normalizeMatch(raw[i]);
      if (hasFlagSet(flagSets, match.flags)) {
        if (alternates) {
          alternates.push(match);
        } else {
          alternates = [match];
        }
      }
    }

    if (alternates) {
      return {
        default: defaultMatch,
        alternates: alternates.sort(compareFlaggedObject),
      };
    }
  }
}

export function clearCache() {
  resolver.clearCache();
}

function tryGetRawMatches(id: string): RawMatch[] | undefined {
  try {
    return resolver.getMatchesSync(id).raw;
  } catch {
    // ignore
  }
}

function normalizeMatch(match: RawMatch): Match {
  return {
    flags: normalizeFlagSet(match.flags),
    value: match.value,
  };
}
