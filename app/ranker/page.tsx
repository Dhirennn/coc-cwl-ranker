"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Trophy, Star, Crown, Swords, Calculator, Users, AlertCircle, Loader2, Key, Eye, EyeOff, ExternalLink, Info } from "lucide-react"
import Link from "next/link"

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

export default function RankerPage() {
  const [clanTag, setClanTag] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [testResult, setTestResult] = useState("")
  const [members, setMembers] = useState<CWLMember[]>([])
  const [leagueInfo, setLeagueInfo] = useState<any>(null)

  const calculateThMultiplier = (attackerTH: number, defenderTH: number) => {
    const diff = defenderTH - attackerTH
    if (diff >= 2) return 1.3  // Attack +2TH (2+ levels up)
    if (diff === 1) return 1.15 // Attack +1TH (1 level up)
    if (diff === 0) return 1.0  // Same TH Level (equal match)
    if (diff === -1) return 0.85 // Attack -1TH (1 level down)
    if (diff <= -2) return 0.7   // Attack -2TH (2+ levels down)
    return 1.0
  }

  const calculateAttackScore = (attack: Attack) => {
    const starPercentage = attack.stars / 3
    const destructionDecimal = attack.destructionPercentage / 100
    const baseScore = (starPercentage * 0.75) + (destructionDecimal * 0.25)
    const thMultiplier = calculateThMultiplier(attack.attackerTH, attack.defenderTH)
    return (baseScore * thMultiplier + 1) * 100 // +1 then *100 to match the formula
  }

  const calculateMemberScore = (member: CWLMember) => {
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
    const participationMultiplier = member.warsParticipated > 0 ? Math.log(member.warsParticipated + 1) / Math.log(7) : 0
    
    return averageScore * participationMultiplier
  }

  const handleAnalyzeClan = async () => {
    if (!clanTag.trim()) {
      setError("Please enter a clan tag")
      return
    }

    // Allow TEST mode without API key
    if (clanTag.trim().toUpperCase() !== 'TEST' && !apiKey.trim()) {
      setError("Please enter your API key (or use 'TEST' as clan tag to try demo data)")
      return
    }

    setLoading(true)
    setError("")
    setTestResult("")
    
    try {
      const response = await fetch('/api/cwl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          clanTag: clanTag.trim(),
          apiKey: apiKey.trim()
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch clan data')
      }

      // Handle IP-TEST response
      if (clanTag.trim().toUpperCase() === 'IP-TEST') {
        const status = data.isUsingExpectedIP ? '✅ SUCCESS' : '⚠️ INFO'
        
        setTestResult(`🌐 IP Address Check for Render Static IPs:\n• Status: ${status}\n• Your outbound IP: ${data.outboundIP}\n• Expected Render IPs: ${data.expectedIPs}\n• Platform: ${data.platform}\n• CoC API test: ${data.cocApiTest}\n\n📋 ${data.instructions}`)
        return
      }

      // Handle special test responses
      if (clanTag.trim().toUpperCase() === 'TEST') {
        // TEST mode handled by backend - show demo data
        setMembers(data.members || [])
        setLeagueInfo(data.leagueInfo)
        return
      }

      setMembers(data.members || [])
      setLeagueInfo(data.leagueInfo)
      
    } catch (err: any) {
      setError(err.message || "Failed to fetch clan data. Please check the clan tag and API key.")
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number, rank: number) => {
    if (rank === 1) return "text-yellow-400"
    if (rank <= 3) return "text-orange-400"
    if (score > 100) return "text-green-400"
    if (score > 0) return "text-blue-400"
    return "text-red-400"
  }

  const getThDiffBadge = (attackerTH: number, defenderTH: number) => {
    const diff = defenderTH - attackerTH
    if (diff >= 2) return <Badge className="bg-green-600 text-white">+{diff} Up</Badge>
    if (diff === 1) return <Badge className="bg-green-500 text-white">+1 Up</Badge>
    if (diff === 0) return <Badge className="bg-blue-500 text-white">Same</Badge>
    if (diff === -1) return <Badge className="bg-orange-500 text-white">-1 Down</Badge>
    return <Badge className="bg-red-500 text-white">{diff} Down</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-yellow-600/30 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-10 w-10 text-yellow-400 drop-shadow-lg" />
              <Crown className="h-5 w-5 text-yellow-300 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-yellow-400 drop-shadow-lg">CWL War Council</h1>
              <p className="text-xs text-blue-300">Fair Bonus Distribution</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Input Section */}
        <Card className="mb-8 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-400/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-yellow-300">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
                  </div>
              CWL Bonus Calculator
                </CardTitle>
                <CardDescription className="text-blue-200">
              Get fair rankings for your CWL bonus distribution based on performance, not just donations or favorites. 
              <br />
              <span className="text-yellow-300 font-medium">Important:</span> You'll need to add specific IP addresses to your API key (shown below).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
            {/* API Key Instructions */}
            <Card className="bg-blue-900/30 border-blue-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-300 text-lg">
                  <Info className="h-5 w-5" />
                  Step 1: Get Your API Key (Takes 2 minutes)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-blue-200 space-y-3">
                  <div className="font-semibold text-blue-100 text-base">Quick Setup - Follow these 4 simple steps:</div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="bg-yellow-500 text-slate-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                      <div>
                        <div className="font-medium text-white">Visit the Clash of Clans Developer Site</div>
                        <a 
                          href="https://developer.clashofclans.com/#/account" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-yellow-300 hover:text-yellow-200 underline inline-flex items-center gap-1 text-sm"
                        >
                          Click here to open developer.clashofclans.com
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="bg-yellow-500 text-slate-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                      <div>
                        <div className="font-medium text-white">Create Your Key</div>
                        <div className="text-sm text-blue-200">Click on "Account" and then "Create New Key" and fill in:</div>
                        <ul className="text-sm text-blue-200 mt-1 ml-4 space-y-1">
                          <li>• <strong>Name:</strong> Any name you want (e.g., "CWL Ranker")</li>
                          <li>• <strong>Description:</strong> Any description (e.g., "For ranking tool")</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="bg-yellow-500 text-slate-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                      <div>
                        <div className="font-medium text-white">Set IP Addresses</div>
                        <div className="text-sm text-blue-200">Copy and paste these IP addresses exactly into the "Allowed IP addresses" field:</div>
                        <div className="bg-slate-700 rounded px-3 py-2 mt-1 font-mono text-yellow-300 text-sm">
                          54.254.162.138,
                          13.228.225.19,
                          18.142.128.26
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          These are Render's static IP addresses for this service
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="bg-yellow-500 text-slate-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                      <div>
                        <div className="font-medium text-white">Copy Your Key</div>
                        <div className="text-sm text-blue-200">After creating, copy the long API key and paste it below</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-300 text-sm">
                      <Shield className="h-4 w-4" />
                      <span className="font-semibold">Your API key is safe:</span>
                    </div>
                    <p className="text-green-200 text-xs mt-1">
                      We don't save your key anywhere. It's only used to get your clan data and sent securely.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

                <div className="space-y-4">
              {/* API Key Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-yellow-300 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Step 2: Enter Your API Key
                </label>
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    placeholder="Paste your API key here (starts with eyJ0...)"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 bg-slate-900/50 border-blue-500/30 text-white placeholder:text-slate-400 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-slate-700"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Clan Tag Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-yellow-300">
                  Step 3: Enter Your Clan Tag
                </label>
                <Input
                  placeholder="Enter your clan tag (e.g., #2ABC123)"
                  value={clanTag}
                  onChange={(e) => setClanTag(e.target.value)}
                  className="flex-1 bg-slate-900/50 border-blue-500/30 text-white placeholder:text-slate-400"
                />
                <div className="text-xs text-blue-300 space-y-1">
                  <div>💡 <strong>Want to try it first?</strong> Enter "TEST" to see how it works with demo data (no API key needed)</div>
                  <div>🔍 <strong>Check your setup:</strong> Enter "IP-TEST" to verify what IP address your requests use (helpful for troubleshooting API key issues)</div>
                </div>
              </div>

              {/* Submit Button */}
                <Button
                onClick={handleAnalyzeClan}
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-slate-900 font-bold py-3 text-lg"
                >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Getting your clan data...
                  </>
                ) : (
                  <>
                    <Trophy className="mr-2 h-5 w-5" />
                    Step 4: Calculate Fair Rankings
                  </>
                )}
                </Button>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-500/30">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {testResult && (
              <div className="flex items-start gap-2 text-blue-400 bg-blue-900/20 p-3 rounded-lg border border-blue-500/30">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
              </div>
            )}
              </CardContent>
            </Card>

        {/* Results */}
        {members.length > 0 && (
          <>
            {/* League Info */}
            {leagueInfo && (
              <Card className="mb-6 bg-gradient-to-br from-purple-800 to-purple-900 border-2 border-purple-400/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-8 w-8 text-purple-300" />
                      <div>
                        <h3 className="text-xl font-bold text-purple-200">CWL Analysis Complete</h3>
                        <p className="text-purple-300">Season: {leagueInfo.season} • League: {leagueInfo.league}</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-600 text-white text-lg px-4 py-2">
                      {members.length} Warriors Analyzed
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rankings Table */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-300">
                  <Swords className="h-6 w-6" />
                  Battle Rankings - Mathematical Justice
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Ranked by mathematical performance: attack efficiency, strategic targeting, and loyalty
                </CardDescription>
              </CardHeader>
              <CardContent>
                    <Table>
                      <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-yellow-300">Rank</TableHead>
                      <TableHead className="text-yellow-300">Warrior</TableHead>
                      <TableHead className="text-yellow-300">TH</TableHead>
                      <TableHead className="text-yellow-300">Wars</TableHead>
                      <TableHead className="text-yellow-300">Attacks</TableHead>
                      <TableHead className="text-yellow-300">Battle Score</TableHead>
                      <TableHead className="text-yellow-300">Attack Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.tag} className="border-slate-700 hover:bg-slate-800/50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                            {member.rank === 1 && <Crown className="h-5 w-5 text-yellow-400" />}
                            {member.rank === 2 && <Trophy className="h-5 w-5 text-slate-300" />}
                            {member.rank === 3 && <Trophy className="h-5 w-5 text-orange-600" />}
                            <span className={`font-bold text-lg ${getScoreColor(member.score, member.rank)}`}>
                              #{member.rank}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-white">{member.name}</div>
                            <div className="text-xs text-slate-400">{member.tag}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                          <Badge className="bg-slate-700 text-yellow-300">
                            TH{member.townHallLevel}
                              </Badge>
                            </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-300">{member.warsParticipated}</span>
                          </div>
                        </TableCell>
                            <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Swords className="h-4 w-4 text-green-400" />
                              <span className="text-green-300">{member.attacks.length}</span>
                            </div>
                            {member.missedAttacks > 0 && (
                              <div className="flex items-center gap-1">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <span className="text-red-300">-{member.missedAttacks}</span>
                              </div>
                            )}
                          </div>
                            </TableCell>
                            <TableCell>
                          <div className="text-right">
                            <div className={`text-xl font-bold ${getScoreColor(member.score, member.rank)}`}>
                              {member.score.toFixed(1)}
                            </div>
                            <div className="text-xs text-slate-500">
                              log₇({member.warsParticipated}) participation
                            </div>
                          </div>
                            </TableCell>
                            <TableCell>
                          <div className="space-y-1">
                            {member.attacks.map((attack, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-400" />
                                  <span>{attack.stars}</span>
                                </div>
                                <div className="text-slate-400">{attack.destructionPercentage}%</div>
                                {getThDiffBadge(attack.attackerTH, attack.defenderTH)}
                              </div>
                            ))}
                          </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
          </>
        )}
      </div>
    </div>
  )
}
