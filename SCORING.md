# Scoring engine specification

The scoring service should calculate points from authoritative FPL gameweek data.

Base rules supplied by the product brief:
- Up to 60 minutes: 1
- 60+ minutes: 2
- GK/DEF goal: 6
- MID goal: 5
- FWD goal: 4
- Assist: 3
- GK/DEF clean sheet: 4
- MID clean sheet: 1
- FWD clean sheet: 0
- 3 GK saves: 1
- Penalty save: 5
- Penalty miss: -2
- 2 goals conceded by GK/DEF: -1
- Yellow: -1
- Red: -3
- Own goal: -2
- BPS bonus: 3/2/1
- Captain doubles points
- Vice captain doubles if captain does not play

The implementation must verify current official FPL scoring definitions before production because the official game can change rules.

Captain/vice-captain logic must be applied after determining whether the captain actually played. Bench auto-substitution and formation validity must also be implemented before final scores are settled.
