"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Trophy, Star, Crown, Swords, Calculator, Users, AlertCircle, Loader2, Key, Eye, EyeOff, ExternalLink, Info, TrendingUp, Target, Award, Zap, Activity, BarChart3, PieChart } from "lucide-react"
import Link from "next/link"
import AdBanner from "@/components/AdBanner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Pie } from 'recharts'

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

interface Analytics {
  bestAttacker: {
    member: CWLMember
    avgScore: number
  }
  mostConsistent: {
    member: CWLMember
    variance: number
  }
  bravest: {
    member: CWLMember
    braveAttacks: number
    braveRatio: number
  }
  mostReliable: {
    member: CWLMember
    missedRate: number
  }
  starMaster: {
    member: CWLMember
    avgStars: number
  }
  destructionExpert: {
    member: CWLMember
    avgDestruction: number
  }
  participationChampion: {
    member: CWLMember
    warsParticipated: number
  }
  generalStats: {
    totalMembers: number
    membersWithAttacks: number
    totalAttacks: number
    totalMissedAttacks: number
    avgStarsPerAttack: number
    participationRate: number
  }
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
  const [analytics, setAnalytics] = useState<Analytics | null>(null)

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
        setTestResult(`🌐 IP Configuration Check:\n• Status: ${data.status}\n• Proxy IP: ${data.proxyIP}\n• API Test: ${data.cocApiTest}\n\n📋 ${data.instructions}`)
        return
      }

      // Handle special test responses
      if (clanTag.trim().toUpperCase() === 'TEST') {
        // TEST mode handled by backend - show demo data
        setMembers(data.members || [])
        setLeagueInfo(data.leagueInfo)
        setAnalytics(data.analytics || null)
        return
      }

      setMembers(data.members || [])
      setLeagueInfo(data.leagueInfo)
      setAnalytics(data.analytics || null)
      
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
        {/* Top Banner Ad */}
        <div className="mb-6">
          <AdBanner 
            adSlot="1234567890" 
            adFormat="horizontal"
            className="max-w-4xl mx-auto"
            style={{ 
              display: 'block',
              width: '728px',
              height: '90px',
              margin: '0 auto'
            }}
          />
        </div>

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
              <span className="text-yellow-300 font-medium">Important:</span> You'll need to add our proxy IP to your API key (shown below).
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
                        <div className="font-medium text-white">Add Proxy IP</div>
                        <div className="text-sm text-blue-200">Copy and paste this IP address into the "Allowed IP addresses" field:</div>
                        <div className="bg-slate-700 rounded px-3 py-2 mt-1 font-mono text-yellow-300 text-sm">
                          45.79.218.79
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          This is the only IP address you need to add
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

        {/* Middle Banner Ad - Shows when user has input but before/after results */}
        {(members.length > 0 || error || testResult) && (
          <div className="mb-6">
            <AdBanner 
              adSlot="0987654321" 
              adFormat="rectangle"
              className="max-w-md mx-auto"
              style={{ 
                display: 'block',
                width: '300px',
                height: '250px',
                margin: '0 auto'
              }}
            />
          </div>
        )}

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

            {/* Analytics Section */}
            {analytics && (
              <Card className="mt-8 bg-gradient-to-br from-green-800 to-green-900 border-2 border-green-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-300">
                    <BarChart3 className="h-6 w-6" />
                    Clan Performance Analytics
                  </CardTitle>
                  <CardDescription className="text-green-200">
                    Detailed insights about your clan's CWL performance and standout warriors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* General Stats Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-yellow-500/20">
                      <div className="text-3xl font-bold text-yellow-300 mb-1">{analytics.generalStats.totalAttacks}</div>
                      <div className="text-sm text-slate-400">Total Attacks</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-blue-500/20">
                      <div className="text-3xl font-bold text-blue-300 mb-1">{analytics.generalStats.avgStarsPerAttack}</div>
                      <div className="text-sm text-slate-400">Avg Stars/Attack</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-green-500/20">
                      <div className="text-3xl font-bold text-green-300 mb-1">{analytics.generalStats.participationRate}%</div>
                      <div className="text-sm text-slate-400">Participation Rate</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-red-500/20">
                      <div className="text-3xl font-bold text-red-300 mb-1">{analytics.generalStats.totalMissedAttacks}</div>
                      <div className="text-sm text-slate-400">Missed Attacks</div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Performers Chart */}
                    <Card className="bg-slate-800/30 border border-slate-600/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <BarChart3 className="h-5 w-5 text-blue-400" />
                          Top Performers by Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={(() => {
                            // Get top 8 performers by score for the chart
                            return members
                              .filter(member => member.attacks.length > 0)
                              .sort((a, b) => b.score - a.score)
                              .slice(0, 8)
                              .map(member => ({
                                name: member.name.length > 12 ? member.name.substring(0, 12) + '...' : member.name,
                                fullName: member.name,
                                score: Number(member.score),
                                rank: member.rank,
                                attacks: member.attacks.length,
                                th: member.townHallLevel
                              }));
                          })()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              tick={{ fill: '#9ca3af', fontSize: 11 }}
                            />
                            <YAxis tick={{ fill: '#9ca3af' }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1f2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#f3f4f6'
                              }}
                              formatter={(value: any, name: any, props: any) => [
                                `${Number(value).toFixed(1)} points`,
                                `${props.payload.fullName} (Rank #${props.payload.rank})`
                              ]}
                              labelFormatter={(label: any, payload: any) => {
                                if (payload && payload[0]) {
                                  return `${payload[0].payload.fullName} - TH${payload[0].payload.th} (${payload[0].payload.attacks} attacks)`;
                                }
                                return label;
                              }}
                            />
                            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Participation Breakdown */}
                    <Card className="bg-slate-800/30 border border-slate-600/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <PieChart className="h-5 w-5 text-green-400" />
                          Participation Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <RechartsPieChart>
                            <Pie
                              data={[
                                { 
                                  name: 'Active Attackers', 
                                  value: analytics.generalStats.membersWithAttacks,
                                  color: '#10b981'
                                },
                                { 
                                  name: 'Non-Attackers', 
                                  value: analytics.generalStats.totalMembers - analytics.generalStats.membersWithAttacks,
                                  color: '#ef4444'
                                }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1f2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#f3f4f6'
                              }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Attack Success Distribution */}
                    <Card className="bg-slate-800/30 border border-slate-600/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                                  <Star className="h-5 w-5 text-yellow-400" />
                          Attack Success Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={(() => {
                            // Calculate star distribution
                            const starCounts: Record<string, number> = { '0 Stars': 0, '1 Star': 0, '2 Stars': 0, '3 Stars': 0 };
                            members.forEach(member => {
                              member.attacks.forEach(attack => {
                                const key = `${attack.stars} Star${attack.stars !== 1 ? 's' : ''}`;
                                starCounts[key] = (starCounts[key] || 0) + 1;
                              });
                            });
                            return Object.entries(starCounts).map(([stars, count]) => ({
                              stars,
                              count,
                              percentage: analytics.generalStats.totalAttacks > 0 ? 
                                ((count / analytics.generalStats.totalAttacks) * 100).toFixed(1) : '0'
                            }));
                          })()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="stars" tick={{ fill: '#9ca3af' }} />
                            <YAxis tick={{ fill: '#9ca3af' }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1f2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#f3f4f6'
                              }}
                              formatter={(value: any, name: any, props: any) => [
                                `${value} attacks (${props.payload.percentage}%)`, 
                                'Count'
                              ]}
                            />
                            <Bar dataKey="count" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Individual Player Attack Performance */}
                    <Card className="bg-slate-800/30 border border-slate-600/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Target className="h-5 w-5 text-red-400" />
                          Top Attackers - Average Stars
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={(() => {
                            // Get top 8 players by average stars
                            return members
                              .filter(member => member.attacks.length > 0)
                              .map(member => ({
                                name: member.name.length > 12 ? member.name.substring(0, 12) + '...' : member.name,
                                fullName: member.name,
                                avgStars: member.attacks.reduce((sum, attack) => sum + attack.stars, 0) / member.attacks.length,
                                totalAttacks: member.attacks.length,
                                th: member.townHallLevel
                              }))
                              .sort((a, b) => b.avgStars - a.avgStars)
                              .slice(0, 8);
                          })()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              tick={{ fill: '#9ca3af', fontSize: 11 }}
                            />
                            <YAxis 
                              tick={{ fill: '#9ca3af' }}
                              domain={[0, 3]}
                              ticks={[0, 1, 2, 3]}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1f2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#f3f4f6'
                              }}
                              formatter={(value: any, name: any, props: any) => [
                                `${Number(value).toFixed(2)} average stars`,
                                `${props.payload.fullName}`
                              ]}
                              labelFormatter={(label: any, payload: any) => {
                                if (payload && payload[0]) {
                                  return `${payload[0].payload.fullName} - TH${payload[0].payload.th} (${payload[0].payload.totalAttacks} attacks)`;
                                }
                                return label;
                              }}
                            />
                            <Bar dataKey="avgStars" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                                </div>

                  {/* Individual Awards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {/* Best Attacker */}
                    <Card className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/40 hover:border-yellow-400/60 transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-yellow-300 text-lg">
                          <Trophy className="h-5 w-5" />
                          Best Attacker
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="font-bold text-white text-lg">{analytics.bestAttacker.member.name}</div>
                          <div className="text-sm text-white mb-2">{analytics.bestAttacker.member.tag}</div>
                          <div className="text-3xl font-bold text-yellow-300 mb-1">{analytics.bestAttacker.avgScore.toFixed(1)}</div>
                          <div className="text-sm font-medium text-white">Average Attack Score</div>
                          <div className="text-xs text-yellow-200 mt-2">
                            {analytics.bestAttacker.member.attacks.length} attacks • TH{analytics.bestAttacker.member.townHallLevel}
                                </div>
                              </div>
                      </CardContent>
                    </Card>

                    {/* Most Consistent */}
                    <Card className="bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-400/40 hover:border-blue-400/60 transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-blue-300 text-lg">
                          <Activity className="h-5 w-5" />
                          Most Consistent
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="font-bold text-white text-lg">{analytics.mostConsistent.member.name}</div>
                          <div className="text-sm text-white mb-2">{analytics.mostConsistent.member.tag}</div>
                          <div className="text-3xl font-bold text-blue-300 mb-1">{analytics.mostConsistent.variance.toFixed(0)}</div>
                          <div className="text-sm font-medium text-white">Score Variance (Lower = Better)</div>
                          <div className="text-xs text-blue-200 mt-2">
                            {analytics.mostConsistent.member.attacks.length} attacks • TH{analytics.mostConsistent.member.townHallLevel}
                            </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bravest Attacker */}
                    <Card className="bg-gradient-to-br from-orange-400/20 to-red-500/20 border border-orange-400/40 hover:border-orange-400/60 transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-orange-300 text-lg">
                          <Zap className="h-5 w-5" />
                          Bravest Warrior
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="font-bold text-white text-lg">{analytics.bravest.member.name}</div>
                          <div className="text-sm text-white mb-2">{analytics.bravest.member.tag}</div>
                          <div className="text-3xl font-bold text-orange-300 mb-1">{(analytics.bravest.braveRatio * 100).toFixed(0)}%</div>
                          <div className="text-sm font-medium text-white">{analytics.bravest.braveAttacks} Attacks vs Higher TH</div>
                          <div className="text-xs text-orange-200 mt-2">
                            {analytics.bravest.member.attacks.length} total attacks • TH{analytics.bravest.member.townHallLevel}
                    </div>
                  </div>
                </CardContent>
              </Card>

                    {/* Most Reliable */}
                    <Card className="bg-gradient-to-br from-emerald-400/20 to-green-600/20 border border-emerald-400/40 hover:border-emerald-400/60 transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-emerald-300 text-lg">
                          <Shield className="h-5 w-5" />
                          Most Reliable
                        </CardTitle>
              </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="font-bold text-white text-lg">{analytics.mostReliable.member.name}</div>
                          <div className="text-sm text-white mb-2">{analytics.mostReliable.member.tag}</div>
                          <div className="text-3xl font-bold text-emerald-300 mb-1">{((1 - analytics.mostReliable.missedRate) * 100).toFixed(0)}%</div>
                          <div className="text-sm font-medium text-white">Attack Completion Rate</div>
                          <div className="text-xs text-emerald-200 mt-2">
                            {analytics.mostReliable.member.attacks.length} attacks • {analytics.mostReliable.member.missedAttacks} missed
                </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Star Master */}
                    <Card className="bg-gradient-to-br from-indigo-400/20 to-purple-600/20 border border-indigo-400/40 hover:border-indigo-400/60 transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-indigo-300 text-lg">
                          <Star className="h-5 w-5" />
                          Star Master
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="font-bold text-white text-lg">{analytics.starMaster.member.name}</div>
                          <div className="text-sm text-white mb-2">{analytics.starMaster.member.tag}</div>
                          <div className="text-3xl font-bold text-indigo-300 mb-1">{analytics.starMaster.avgStars.toFixed(1)}</div>
                          <div className="text-sm font-medium text-white">Average Stars per Attack</div>
                          <div className="text-xs text-indigo-200 mt-2">
                            {analytics.starMaster.member.attacks.reduce((sum, attack) => sum + attack.stars, 0)} total stars
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Destruction Expert */}
                    <Card className="bg-gradient-to-br from-rose-400/20 to-pink-600/20 border border-rose-400/40 hover:border-rose-400/60 transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-rose-300 text-lg">
                          <Target className="h-5 w-5" />
                          Destruction Expert
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="font-bold text-white text-lg">{analytics.destructionExpert.member.name}</div>
                          <div className="text-sm text-white mb-2">{analytics.destructionExpert.member.tag}</div>
                          <div className="text-3xl font-bold text-rose-300 mb-1">{analytics.destructionExpert.avgDestruction.toFixed(0)}%</div>
                          <div className="text-sm font-medium text-white">Average Destruction</div>
                          <div className="text-xs text-rose-200 mt-2">
                            {analytics.destructionExpert.member.attacks.length} attacks • TH{analytics.destructionExpert.member.townHallLevel}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Participation Champion */}
                  <Card className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-yellow-400/40 hover:border-yellow-400/60 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-yellow-400/20 p-4 rounded-lg border border-yellow-400/30">
                            <Users className="h-10 w-10 text-yellow-300" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-yellow-300">Participation Champion</h3>
                            <p className="text-yellow-200 text-lg">{analytics.participationChampion.member.name} - Most Dedicated Warrior</p>
                            <div className="text-sm text-slate-400 mt-1">
                              {analytics.participationChampion.member.tag} • TH{analytics.participationChampion.member.townHallLevel}
                      </div>
                    </div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-yellow-300 mb-1">{analytics.participationChampion.warsParticipated}</div>
                          <div className="text-sm text-slate-400">Wars Participated</div>
                          <div className="text-xs text-yellow-200 mt-1">
                            {analytics.participationChampion.member.attacks.length} total attacks
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}

            {/* Bottom Banner Ad - After results */}
            <div className="mt-8 mb-6">
              <AdBanner 
                adSlot="1357924680" 
                adFormat="horizontal"
                className="max-w-4xl mx-auto"
                style={{ 
                  display: 'block',
                  width: '728px',
                  height: '90px',
                  margin: '0 auto'
                }}
              />
                </div>
              </>
        )}
      </div>
    </div>
  )
}
