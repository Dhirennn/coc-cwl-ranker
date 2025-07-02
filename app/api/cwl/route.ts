import { NextRequest, NextResponse } from 'next/server'

// You'll need to get your API token from https://developer.clashofclans.com/
const COC_API_TOKEN = process.env.COC_API_TOKEN || 'YOUR_API_TOKEN_HERE'
const COC_API_BASE = 'https://api.clashofclans.com/v1'

interface CWLMember {
  tag: string
  name: string
  townHallLevel: number
  attacks: Attack[]
  missedAttacks: number
  warsParticipated: number
  score: number
  rank: number
}

interface Attack {
  stars: number
  destructionPercentage: number
  defenderTH: number
  attackerTH: number
}

async function fetchWithAuth(url: string) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${COC_API_TOKEN}`,
      'Accept': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`CoC API error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

function calculateThMultiplier(attackerTH: number, defenderTH: number): number {
  const diff = defenderTH - attackerTH
  if (diff >= 2) return 1.3  // Hero Bonus
  if (diff === 1) return 1.15 // Brave
  if (diff === 0) return 1.0  // Fair
  if (diff === -1) return 0.85 // Weak
  if (diff <= -2) return 0.7   // Coward
  return 1.0
}

function calculateAttackScore(attack: Attack): number {
  const starPercentage = attack.stars / 3
  const destructionDecimal = attack.destructionPercentage / 100
  const baseScore = (starPercentage * 0.75) + (destructionDecimal * 0.25)
  const thMultiplier = calculateThMultiplier(attack.attackerTH, attack.defenderTH)
  return (baseScore * thMultiplier + 1) * 100 // +1 then *100 to match the formula
}

function calculateMemberScore(member: CWLMember): number {
  let totalScore = 0
  
  // Add attack scores
  member.attacks.forEach(attack => {
    totalScore += calculateAttackScore(attack)
  })
  
  // Add missed attack penalties (-100 each)
  totalScore += (member.missedAttacks * -100)
  
  // Calculate average
  const totalPossibleAttacks = member.attacks.length + member.missedAttacks
  const averageScore = totalPossibleAttacks > 0 ? totalScore / totalPossibleAttacks : 0
  
  // Apply participation multiplier
  const participationMultiplier = member.warsParticipated > 0 ? Math.log(member.warsParticipated) / Math.log(7) : 0
  
  return averageScore * participationMultiplier
}

export async function POST(request: NextRequest) {
  try {
    const { clanTag } = await request.json()
    
    if (!clanTag) {
      return NextResponse.json({ error: 'Clan tag is required' }, { status: 400 })
    }

    // TEST MODE: Use 'TEST' as clan tag to see mock data
    if (clanTag.toUpperCase() === 'TEST') {
      const mockMembers: CWLMember[] = [
        {
          tag: '#PLAYER1',
          name: 'Elite Warrior',
          townHallLevel: 16,
          attacks: [
            { stars: 3, destructionPercentage: 100, defenderTH: 17, attackerTH: 16 }, // +1 TH brave attack
            { stars: 2, destructionPercentage: 85, defenderTH: 16, attackerTH: 16 },   // Same TH
          ],
          missedAttacks: 0,
          warsParticipated: 7,
          score: 0,
          rank: 0
        },
        {
          tag: '#PLAYER2', 
          name: 'Strategic Master',
          townHallLevel: 15,
          attacks: [
            { stars: 2, destructionPercentage: 95, defenderTH: 17, attackerTH: 15 }, // +2 TH hero attack!
            { stars: 3, destructionPercentage: 100, defenderTH: 16, attackerTH: 15 }, // +1 TH brave
          ],
          missedAttacks: 0,
          warsParticipated: 6,
          score: 0,
          rank: 0
        },
        {
          tag: '#PLAYER3',
          name: 'Casual Attacker', 
          townHallLevel: 14,
          attacks: [
            { stars: 2, destructionPercentage: 70, defenderTH: 13, attackerTH: 14 }, // -1 TH weak
            { stars: 1, destructionPercentage: 60, defenderTH: 12, attackerTH: 14 }, // -2 TH coward
          ],
          missedAttacks: 1, // Missed one attack!
          warsParticipated: 5,
          score: 0,
          rank: 0
        },
        {
          tag: '#PLAYER4',
          name: 'Perfect Player',
          townHallLevel: 15,
          attacks: [
            { stars: 3, destructionPercentage: 100, defenderTH: 17, attackerTH: 15 }, // +2 TH hero!
            { stars: 3, destructionPercentage: 100, defenderTH: 16, attackerTH: 15 }, // +1 TH brave
          ],
          missedAttacks: 0,
          warsParticipated: 7,
          score: 0,
          rank: 0
        },
        {
          tag: '#PLAYER5',
          name: 'Unreliable Member',
          townHallLevel: 16,
          attacks: [
            { stars: 1, destructionPercentage: 50, defenderTH: 16, attackerTH: 16 }, // Poor attack
          ],
          missedAttacks: 3, // Missed lots of attacks
          warsParticipated: 4,
          score: 0,
          rank: 0
        }
      ]

      // Calculate scores and rank
      const rankedMembers = mockMembers
        .map(member => ({
          ...member,
          score: calculateMemberScore(member)
        }))
        .sort((a, b) => b.score - a.score)
        .map((member, index) => ({
          ...member,
          rank: index + 1
        }))

      return NextResponse.json({
        success: true,
        leagueInfo: {
          season: '2024-01-TEST',
          state: 'inWar',
          league: 'Test League'
        },
        members: rankedMembers,
        totalWars: 7
      })
    }

    // URL encode the clan tag (replace # with %23)
    const encodedClanTag = encodeURIComponent(clanTag)
    
    // Step 1: Get current CWL league group
    const leagueGroupUrl = `${COC_API_BASE}/clans/${encodedClanTag}/currentwar/leaguegroup`
    const leagueGroup = await fetchWithAuth(leagueGroupUrl)
    
    if (!leagueGroup || leagueGroup.state === 'notInWar') {
      return NextResponse.json({ error: 'Clan is not currently in CWL' }, { status: 404 })
    }

    // Step 2: Get all war data from the league group
    const warPromises = leagueGroup.rounds.flatMap((round: any) => 
      round.warTags.map((warTag: string) => {
        if (warTag === '#0') return null // Skip placeholder wars
        const encodedWarTag = encodeURIComponent(warTag)
        return fetchWithAuth(`${COC_API_BASE}/clanwarleagues/wars/${encodedWarTag}`)
      })
    ).filter(Boolean)

    const wars = await Promise.all(warPromises)
    
    // Step 3: Get clan member data
    const clanUrl = `${COC_API_BASE}/clans/${encodedClanTag}`
    const clanData = await fetchWithAuth(clanUrl)
    
    // Step 4: Process war data and calculate scores
    const memberMap = new Map<string, CWLMember>()
    
    // Initialize members
    clanData.memberList.forEach((member: any) => {
      memberMap.set(member.tag, {
        tag: member.tag,
        name: member.name,
        townHallLevel: member.townHallLevel,
        attacks: [],
        missedAttacks: 0,
        warsParticipated: 0,
        score: 0,
        rank: 0
      })
    })

    // Process each war
    wars.forEach((war: any) => {
      if (!war || !war.clan || !war.opponent) return

      // Determine which clan is ours
      const ourClan = war.clan.tag === clanTag ? war.clan : war.opponent
      const enemyClan = war.clan.tag === clanTag ? war.opponent : war.clan
      
      if (!ourClan) return

      // Track participation
      ourClan.members?.forEach((member: any) => {
        if (memberMap.has(member.tag)) {
          const memberData = memberMap.get(member.tag)!
          memberData.warsParticipated++
          
          // Calculate expected attacks (usually 2 per war)
          const expectedAttacks = war.attacksPerMember || 2
          const actualAttacks = member.attacks?.length || 0
          memberData.missedAttacks += Math.max(0, expectedAttacks - actualAttacks)
          
          // Process attacks
          member.attacks?.forEach((attack: any) => {
            // Find defender info
            const defender = enemyClan.members?.find((m: any) => m.tag === attack.defenderTag)
            if (defender) {
              memberData.attacks.push({
                stars: attack.stars,
                destructionPercentage: attack.destructionPercentage,
                defenderTH: defender.townhallLevel,
                attackerTH: member.townhallLevel
              })
            }
          })
        }
      })
    })

    // Calculate final scores and rankings
    const members = Array.from(memberMap.values())
      .map(member => ({
        ...member,
        score: calculateMemberScore(member)
      }))
      .sort((a, b) => b.score - a.score)
      .map((member, index) => ({
        ...member,
        rank: index + 1
      }))

    return NextResponse.json({
      success: true,
      leagueInfo: {
        season: leagueGroup.season,
        state: leagueGroup.state
      },
      members,
      totalWars: wars.length
    })

  } catch (error) {
    console.error('CWL API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CWL data. Please check the clan tag and try again.' },
      { status: 500 }
    )
  }
} 