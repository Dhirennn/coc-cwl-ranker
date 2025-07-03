import { NextRequest, NextResponse } from 'next/server'
import { initializePing } from '@/lib/ping-utils'

// COC API base URL - Using RoyaleAPI proxy for better reliability
const COC_API_BASE = 'https://cocproxy.royaleapi.dev/v1'

// Track if ping has been initialized to avoid duplicate intervals
let isPingInitialized = false

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

async function fetchWithAuth(url: string, apiKey: string) {
  console.log(`🌐 Making API request to: ${url}`)
  console.log(`🔑 Using API key: ${apiKey.substring(0, 20)}...`)
  console.log(`🚀 Using RoyaleAPI proxy (45.79.218.79)`)
  
  const fetchOptions: RequestInit = {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    }
  }

  const response = await fetch(url, fetchOptions)
  
  console.log(`📡 Response status: ${response.status} ${response.statusText}`)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`❌ API Error Response:`, errorText)
    console.error(`🔍 Debug info:`)
    console.error(`   - URL: ${url}`)
    console.error(`   - API Key prefix: ${apiKey.substring(0, 20)}...`)
    console.error(`   - Response: ${response.status} ${response.statusText}`)
    
    if (response.status === 403) {
      throw new Error(`Invalid API key or IP not allowed. Please make sure you've added 45.79.218.79 to your API key's allowed IPs.`)
    }
    if (response.status === 404) {
      throw new Error('Clan not found. Please check the clan tag.')
    }
    if (response.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.')
    }
    throw new Error(`CoC API error: ${response.status} ${response.statusText}. Details: ${errorText}`)
  }
  
  const data = await response.json()
  console.log(`✅ API request successful`)
  return data
}

function calculateThMultiplier(attackerTH: number, defenderTH: number): number {
  const diff = defenderTH - attackerTH
  if (diff >= 2) return 1.3  // Attack +2TH (2+ levels up)
  if (diff === 1) return 1.15 // Attack +1TH (1 level up)
  if (diff === 0) return 1.0  // Same TH Level (equal match)
  if (diff === -1) return 0.85 // Attack -1TH (1 level down)
  if (diff <= -2) return 0.7   // Attack -2TH (2+ levels down)
  return 1.0
}

function calculateAttackScore(attack: Attack): number {
  const starPercentage = attack.stars / 3
  const destructionDecimal = attack.destructionPercentage / 100
  const baseScore = (starPercentage * 0.75) + (destructionDecimal * 0.25)
  const thMultiplier = calculateThMultiplier(attack.attackerTH, attack.defenderTH)
  const finalScore = (baseScore * thMultiplier + 1) * 100 // +1 then *100 to match the formula
  
  console.log(`🎯 Attack Score Calculation:`)
  console.log(`   Stars: ${attack.stars}/3 (${starPercentage.toFixed(3)})`)
  console.log(`   Destruction: ${attack.destructionPercentage}% (${destructionDecimal.toFixed(3)})`)
  console.log(`   TH: ${attack.attackerTH} vs ${attack.defenderTH} (diff: ${attack.defenderTH - attack.attackerTH})`)
  console.log(`   Base Score: (${starPercentage.toFixed(3)} * 0.75) + (${destructionDecimal.toFixed(3)} * 0.25) = ${baseScore.toFixed(3)}`)
  console.log(`   TH Multiplier: ${thMultiplier}`)
  console.log(`   Final Score: (${baseScore.toFixed(3)} * ${thMultiplier} + 1) * 100 = ${finalScore.toFixed(2)}`)
  console.log(``)
  
  return finalScore
}

function calculateMemberScore(member: CWLMember): number {
  console.log(`\n🏆 Calculating score for ${member.name} (${member.tag})`)
  console.log(`   TH Level: ${member.townHallLevel}`)
  console.log(`   Wars Participated: ${member.warsParticipated}`)
  console.log(`   Attacks Made: ${member.attacks.length}`)
  console.log(`   Missed Attacks: ${member.missedAttacks}`)
  
  let totalScore = 0
  
  // Add attack scores
  member.attacks.forEach((attack, index) => {
    console.log(`\n   Attack ${index + 1}:`)
    const attackScore = calculateAttackScore(attack)
    totalScore += attackScore
    console.log(`   Running Total: ${totalScore.toFixed(2)}`)
  })
  
  // Add missed attack penalties (-100 each)
  const missedPenalty = member.missedAttacks * -100
  totalScore += missedPenalty
  console.log(`\n   Missed Attack Penalty: ${member.missedAttacks} * -100 = ${missedPenalty}`)
  console.log(`   Total Score After Penalties: ${totalScore.toFixed(2)}`)
  
  // Calculate average
  const totalPossibleAttacks = member.attacks.length + member.missedAttacks
  const averageScore = totalPossibleAttacks > 0 ? totalScore / totalPossibleAttacks : 0
  console.log(`   Total Possible Attacks: ${totalPossibleAttacks}`)
  console.log(`   Average Score: ${totalScore.toFixed(2)} / ${totalPossibleAttacks} = ${averageScore.toFixed(2)}`)
  
  // Apply participation multiplier
  const participationMultiplier = member.warsParticipated > 0 ? Math.log(member.warsParticipated + 1) / Math.log(7) : 0
  const finalScore = averageScore * participationMultiplier
  
  console.log(`   Participation Multiplier: log₇(${member.warsParticipated} + 1) = log₇(${member.warsParticipated + 1}) = ${participationMultiplier.toFixed(4)}`)
  console.log(`   🎯 FINAL SCORE: ${averageScore.toFixed(2)} * ${participationMultiplier.toFixed(4)} = ${finalScore.toFixed(2)}`)
  console.log(`\n${'='.repeat(60)}`)
  
  return finalScore
}

// Helper function to normalize clan tags for comparison
function normalizeClanTag(tag: string): string {
  return tag.replace('#', '').toUpperCase()
}

export async function POST(request: NextRequest) {
  // Initialize ping mechanism on first API call (only in production)
  if (!isPingInitialized) {
    try {
      initializePing()
      isPingInitialized = true
      console.log('🏓 Ping mechanism initialized from CWL API')
    } catch (error) {
      console.error('⚠️ Failed to initialize ping mechanism:', error)
    }
  }

  try {
    const { clanTag, apiKey } = await request.json()
    
    if (!clanTag) {
      return NextResponse.json({ error: 'Clan tag is required' }, { status: 400 })
    }

    // IP TEST: Check what IP address is being used
    if (clanTag.toUpperCase() === 'IP-TEST') {
      try {
        console.log(`🔍 IP-TEST requested - checking outbound IP`)
        
        // Test 1: Check our outbound IP
        const ipResponse = await fetch('https://httpbin.org/ip', {
          method: 'GET'
        })
        
        let ipResult = 'Could not determine'
        if (ipResponse.ok) {
          const ipData = await ipResponse.json()
          console.log(`📍 IP-TEST result: ${ipData.origin}`)
          ipResult = ipData.origin
        }

        // Test 2: Test a simple request to CoC API to see if it's accessible
        console.log(`🧪 Testing RoyaleAPI proxy accessibility...`)
        let apiTest = 'Not tested'
        try {
          const testResponse = await fetch('https://cocproxy.royaleapi.dev/v1/leagues', {
            headers: {
              'Accept': 'application/json'
            }
          })
          apiTest = testResponse.ok ? `✅ Accessible (${testResponse.status})` : `❌ Failed (${testResponse.status})`
          console.log(`🧪 RoyaleAPI proxy test: ${apiTest}`)
        } catch (error) {
          apiTest = `❌ Error: ${error}`
          console.log(`🧪 RoyaleAPI proxy test error: ${error}`)
        }

        // With RoyaleAPI proxy, we don't need to worry about our server's IP
        const proxyIP = '45.79.218.79'
        
        return NextResponse.json({
          success: true,
          message: 'IP Configuration Check',
          proxyIP: proxyIP,
          cocApiTest: apiTest,
          status: `✅ Using RoyaleAPI proxy`,
          instructions: `✅ Your requests will go through our proxy (${proxyIP}). Make sure this IP is allowed in your API key settings.`,
          platform: 'RoyaleAPI Proxy'
        })
        
      } catch (error) {
        console.error(`❌ IP-TEST error:`, error)
        return NextResponse.json({
          success: false,
          message: 'Error checking IP address',
          platform: 'Render Web Service',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
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

    // For real API calls, require API key
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key is required. Please follow the instructions above to get your Clash of Clans API key.' 
      }, { status: 400 })
    }

    // Validate API key format (basic check)
    // if (!apiKey.startsWith('eyJ') || apiKey.length < 100) {
    //   return NextResponse.json({ 
    //     error: 'Invalid API key format. Please make sure you copied the complete API key from the Clash of Clans developer portal.' 
    //   }, { status: 400 })
    // }

    // URL encode the clan tag (replace # with %23)
    const encodedClanTag = encodeURIComponent(clanTag)
    
    // Step 1: Get current CWL league group
    const leagueGroupUrl = `${COC_API_BASE}/clans/${encodedClanTag}/currentwar/leaguegroup`
    const leagueGroup = await fetchWithAuth(leagueGroupUrl, apiKey)
    
    if (!leagueGroup || leagueGroup.state === 'notInWar') {
      return NextResponse.json({ error: 'Clan is not currently in CWL' }, { status: 404 })
    }

    // Step 2: Get all war data from the league group
    const warPromises = leagueGroup.rounds.flatMap((round: any) => 
      round.warTags.map((warTag: string) => {
        if (warTag === '#0') return null // Skip placeholder wars
        const encodedWarTag = encodeURIComponent(warTag)
        return fetchWithAuth(`${COC_API_BASE}/clanwarleagues/wars/${encodedWarTag}`, apiKey)
      })
    ).filter(Boolean)

    const wars = await Promise.all(warPromises)
    
    // Step 3: Get clan member data
    const clanUrl = `${COC_API_BASE}/clans/${encodedClanTag}`
    const clanData = await fetchWithAuth(clanUrl, apiKey)
    
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
    console.log(`\n🏰 Processing ${wars.length} wars for clan ${clanTag}`)
    wars.forEach((war: any, warIndex: number) => {
      if (!war || !war.clan || !war.opponent) {
        console.log(`⚠️ War ${warIndex + 1}: Invalid war data, skipping`)
        return
      }

      // Check if our clan is participating in this specific war
      const clanInWar = normalizeClanTag(war.clan.tag) === normalizeClanTag(clanTag)
      const opponentInWar = normalizeClanTag(war.opponent.tag) === normalizeClanTag(clanTag)
      
      if (!clanInWar && !opponentInWar) {
        console.log(`⚠️ War ${warIndex + 1}: ${war.clan.name} vs ${war.opponent.name} - Our clan not participating, skipping`)
        return
      }

      // Determine which clan is ours
      const ourClan = clanInWar ? war.clan : war.opponent
      const enemyClan = clanInWar ? war.opponent : war.clan

      console.log(`\n⚔️ War ${warIndex + 1}: ${ourClan.name} vs ${enemyClan.name}`)
      console.log(`   State: ${war.state}`)
      console.log(`   Attacks per member: ${war.attacksPerMember || 2}`)
      console.log(`   Our clan members in war: ${ourClan.members?.length || 0}`)

      // Only count wars where attacks can be made (not preparation phase)
      const canAttack = war.state === 'inWar' || war.state === 'warEnded'
      if (!canAttack) {
        console.log(`   ⏳ War in preparation phase - skipping attack calculations`)
        return
      }

      // Track participation
      ourClan.members?.forEach((member: any) => {
        if (memberMap.has(member.tag)) {
          const memberData = memberMap.get(member.tag)!
          memberData.warsParticipated++
          
          console.log(`\n   👤 ${member.name} (${member.tag}) - TH${member.townhallLevel}`)
          
          // Calculate expected attacks (CWL gives 1 attack per member per war)
          const expectedAttacks = 1
          const actualAttacks = member.attacks?.length || 0
          const missedInThisWar = Math.max(0, expectedAttacks - actualAttacks)
          memberData.missedAttacks += missedInThisWar
          
          console.log(`      Expected attacks: ${expectedAttacks}, Made: ${actualAttacks}, Missed: ${missedInThisWar}`)
          
          // Process attacks
          member.attacks?.forEach((attack: any, attackIndex: number) => {
            // Find defender info
            const defender = enemyClan.members?.find((m: any) => m.tag === attack.defenderTag)
            if (defender) {
              const attackData = {
                stars: attack.stars,
                destructionPercentage: attack.destructionPercentage,
                defenderTH: defender.townhallLevel,
                attackerTH: member.townhallLevel
              }
              memberData.attacks.push(attackData)
              
              console.log(`      Attack ${attackIndex + 1}: ${attack.stars}⭐ ${attack.destructionPercentage}% vs TH${defender.townhallLevel}`)
            } else {
              console.log(`      ⚠️ Attack ${attackIndex + 1}: Could not find defender ${attack.defenderTag}`)
            }
          })
        } else {
          console.log(`   ⚠️ Member ${member.name} (${member.tag}) not found in clan member list`)
        }
      })
    })

    console.log(`\n📊 Final member data summary:`)
    memberMap.forEach((member, tag) => {
      console.log(`   ${member.name}: ${member.warsParticipated} wars, ${member.attacks.length} attacks, ${member.missedAttacks} missed`)
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