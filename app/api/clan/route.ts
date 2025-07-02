import { type NextRequest, NextResponse } from "next/server"

// This would be your actual CoC API key
const COC_API_KEY = process.env.COC_API_KEY || "your-api-key-here"
const COC_API_BASE = "https://api.clashofclans.com/v1"

interface CoCPlayer {
  tag: string
  name: string
  townHallLevel: number
}

interface CoCClan {
  tag: string
  name: string
  memberList: CoCPlayer[]
}

interface CWLAttack {
  attackerTag: string
  defenderTag: string
  stars: number
  destructionPercentage: number
}

interface CWLWar {
  attacks: CWLAttack[]
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const clanTag = searchParams.get("tag")

  if (!clanTag) {
    return NextResponse.json({ error: "Clan tag is required" }, { status: 400 })
  }

  try {
    // Fetch clan information
    const clanResponse = await fetch(`${COC_API_BASE}/clans/${encodeURIComponent(clanTag)}`, {
      headers: {
        Authorization: `Bearer ${COC_API_KEY}`,
        Accept: "application/json",
      },
    })

    if (!clanResponse.ok) {
      throw new Error("Failed to fetch clan data")
    }

    const clanData: CoCClan = await clanResponse.json()

    // Fetch current CWL group
    const cwlResponse = await fetch(`${COC_API_BASE}/clans/${encodeURIComponent(clanTag)}/currentwar/leaguegroup`, {
      headers: {
        Authorization: `Bearer ${COC_API_KEY}`,
        Accept: "application/json",
      },
    })

    if (!cwlResponse.ok) {
      throw new Error("Failed to fetch CWL data")
    }

    const cwlData = await cwlResponse.json()

    // Process CWL wars and calculate rankings
    const memberStats = new Map()

    // Initialize member stats
    clanData.memberList.forEach((member) => {
      memberStats.set(member.tag, {
        name: member.name,
        townHall: member.townHallLevel,
        attacks: [],
        warsParticipated: 0,
        missedAttacks: 0,
      })
    })

    // Process each war in the CWL
    for (const warTag of cwlData.rounds.flat()) {
      try {
        const warResponse = await fetch(`${COC_API_BASE}/clanwarleagues/wars/${warTag}`, {
          headers: {
            Authorization: `Bearer ${COC_API_KEY}`,
            Accept: "application/json",
          },
        })

        if (warResponse.ok) {
          const warData: CWLWar = await warResponse.json()

          // Process attacks for this war
          warData.attacks?.forEach((attack) => {
            if (memberStats.has(attack.attackerTag)) {
              const member = memberStats.get(attack.attackerTag)
              member.attacks.push({
                stars: attack.stars,
                destructionPercentage: attack.destructionPercentage,
                opponentTownHall: 14, // This would need to be fetched from defender data
                attackScore: calculateAttackScore(attack.stars, attack.destructionPercentage, member.townHall, 14),
              })
            }
          })
        }
      } catch (error) {
        console.error("Error fetching war data:", error)
      }
    }

    // Calculate final scores
    const rankedMembers = Array.from(memberStats.values())
      .map((member) => {
        const avgAttackScore =
          member.attacks.length > 0
            ? member.attacks.reduce((sum: number, attack: any) => sum + attack.attackScore, 0) / member.attacks.length
            : 0

        const participationMultiplier =
          member.warsParticipated > 0 ? Math.log(member.warsParticipated) / Math.log(7) : 0

        const finalScore = avgAttackScore * participationMultiplier - member.missedAttacks * 100

        return {
          ...member,
          finalScore,
        }
      })
      .sort((a, b) => b.finalScore - a.finalScore)
      .map((member, index) => ({ ...member, rank: index + 1 }))

    return NextResponse.json({
      clan: clanData,
      rankings: rankedMembers,
    })
  } catch (error) {
    console.error("Error fetching clan data:", error)
    return NextResponse.json({ error: "Failed to fetch clan data" }, { status: 500 })
  }
}

function calculateAttackScore(
  stars: number,
  destructionPercentage: number,
  attackerTH: number,
  defenderTH: number,
): number {
  const starScore = (stars / 3) * 0.75
  const destructionScore = (destructionPercentage / 100) * 0.25
  const baseScore = starScore + destructionScore

  // Calculate TH multiplier
  const thDifference = defenderTH - attackerTH
  let thMultiplier = 1.0

  if (thDifference >= 2) thMultiplier = 1.3
  else if (thDifference === 1) thMultiplier = 1.15
  else if (thDifference === 0) thMultiplier = 1.0
  else if (thDifference === -1) thMultiplier = 0.85
  else if (thDifference <= -2) thMultiplier = 0.7

  return (baseScore * thMultiplier + 1) * 100 // +1 and *100 for the formula adjustment
}
