"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Search, Upload, Download, Trophy, Star, Target, Crown, Swords, Zap } from "lucide-react"
import Link from "next/link"

interface ClanMember {
  name: string
  townHall: number
  attacks: Attack[]
  warsParticipated: number
  missedAttacks: number
  finalScore: number
  rank: number
}

interface Attack {
  stars: number
  destructionPercentage: number
  opponentTownHall: number
  attackScore: number
}

export default function RankerPage() {
  const [clanTag, setClanTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [clanData, setClanData] = useState<ClanMember[]>([])
  const [activeTab, setActiveTab] = useState("input")

  // Sample data for demonstration
  const sampleData: ClanMember[] = [
    {
      name: "⚡DragonSlayer⚡",
      townHall: 15,
      attacks: [
        { stars: 3, destructionPercentage: 95, opponentTownHall: 15, attackScore: 195 },
        { stars: 2, destructionPercentage: 87, opponentTownHall: 16, attackScore: 178 },
      ],
      warsParticipated: 7,
      missedAttacks: 0,
      finalScore: 186.5,
      rank: 1,
    },
    {
      name: "🔥ClanWarrior🔥",
      townHall: 14,
      attacks: [
        { stars: 3, destructionPercentage: 89, opponentTownHall: 14, attackScore: 189 },
        { stars: 3, destructionPercentage: 92, opponentTownHall: 15, attackScore: 207 },
      ],
      warsParticipated: 6,
      missedAttacks: 1,
      finalScore: 82.4,
      rank: 2,
    },
    {
      name: "💀BaseDestroyer💀",
      townHall: 13,
      attacks: [
        { stars: 2, destructionPercentage: 78, opponentTownHall: 14, attackScore: 165 },
        { stars: 1, destructionPercentage: 65, opponentTownHall: 13, attackScore: 91 },
      ],
      warsParticipated: 5,
      missedAttacks: 2,
      finalScore: -72.1,
      rank: 3,
    },
  ]

  const handleFetchClan = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setClanData(sampleData)
      setActiveTab("results")
      setIsLoading(false)
    }, 2000)
  }

  const calculateTHMultiplier = (playerTH: number, opponentTH: number): number => {
    const diff = opponentTH - playerTH
    if (diff >= 2) return 1.3
    if (diff === 1) return 1.15
    if (diff === 0) return 1.0
    if (diff === -1) return 0.85
    return 0.7
  }

  const getMultiplierBadge = (multiplier: number) => {
    if (multiplier >= 1.3) return <Badge className="bg-green-600 text-white">Hero</Badge>
    if (multiplier >= 1.15) return <Badge className="bg-green-500 text-white">Brave</Badge>
    if (multiplier === 1.0) return <Badge className="bg-blue-500 text-white">Fair</Badge>
    if (multiplier >= 0.85) return <Badge className="bg-orange-500 text-white">Weak</Badge>
    return <Badge className="bg-red-500 text-white">Coward</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-yellow-600/30 bg-slate-900/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-10 w-10 text-yellow-400 drop-shadow-lg" />
              <Crown className="h-5 w-5 text-yellow-300 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-yellow-400 drop-shadow-lg">War Room</h1>
              <p className="text-xs text-blue-300">Battle Analysis Center</p>
            </div>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="border-blue-400 text-blue-200 hover:bg-slate-700/50 hover:text-yellow-300 bg-transparent"
            >
              Return to Council
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-4">
            Clan War League Battle Analysis
          </h2>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            Enter your clan tag to fetch CWL battle data and calculate fair bonus rankings using our legendary
            algorithm.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-blue-500/30">
            <TabsTrigger value="input" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900">
              Clan Intelligence
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900"
            >
              Battle Rankings
            </TabsTrigger>
            <TabsTrigger
              value="formula"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900"
            >
              War Formula
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-yellow-300">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  Fetch Clan Intelligence
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Enter your clan tag to automatically gather CWL battle data from the Clash of Clans archives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="clanTag" className="text-blue-200">
                      Clan Tag
                    </Label>
                    <Input
                      id="clanTag"
                      placeholder="#2PP"
                      value={clanTag}
                      onChange={(e) => setClanTag(e.target.value)}
                      className="mt-1 bg-slate-700/50 border-blue-500/30 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleFetchClan}
                  disabled={isLoading || !clanTag}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-slate-900 font-bold"
                >
                  {isLoading ? "Gathering Intelligence..." : "Fetch Battle Data"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-yellow-300">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  Manual Battle Records
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Alternatively, upload a scroll (CSV file) with your clan's CWL battle records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-blue-400/50 rounded-lg p-8 text-center bg-slate-700/20">
                  <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-200 mb-2">Drop your battle scroll here or click to browse</p>
                  <Button
                    variant="outline"
                    className="border-blue-400 text-blue-200 hover:bg-slate-700/50 bg-transparent"
                  >
                    Choose Battle Scroll
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Demo Button */}
            <Card className="border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-900/20 to-orange-900/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-full">
                      <Swords className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <p className="text-yellow-200 mb-4 text-lg">
                    Want to witness our algorithm in action? Try our demo battle data!
                  </p>
                  <Button
                    onClick={() => {
                      setClanData(sampleData)
                      setActiveTab("results")
                    }}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-slate-900 font-bold"
                  >
                    <Trophy className="mr-2 h-5 w-5" />
                    Load Demo Battle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {clanData.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                    ⚔️ CWL Battle Rankings ⚔️
                  </h3>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-yellow-400 text-yellow-300 hover:bg-slate-700/50 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    Export Battle Results
                  </Button>
                </div>

                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-400/30">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-yellow-400/30">
                          <TableHead className="text-yellow-300 font-bold">Rank</TableHead>
                          <TableHead className="text-yellow-300 font-bold">Warrior</TableHead>
                          <TableHead className="text-yellow-300 font-bold">TH</TableHead>
                          <TableHead className="text-yellow-300 font-bold">Wars</TableHead>
                          <TableHead className="text-yellow-300 font-bold">Deserted</TableHead>
                          <TableHead className="text-yellow-300 font-bold">Avg Battle Score</TableHead>
                          <TableHead className="text-yellow-300 font-bold">Final Score</TableHead>
                          <TableHead className="text-yellow-300 font-bold">Bonus Worthy</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clanData.map((member, index) => (
                          <TableRow key={member.name} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {index === 0 && <Crown className="h-5 w-5 text-yellow-400" />}
                                {index < 3 && index > 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                                <span className="font-bold text-yellow-300">#{member.rank}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-blue-200">{member.name}</TableCell>
                            <TableCell>
                              <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                TH{member.townHall}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-blue-200">{member.warsParticipated}/7</TableCell>
                            <TableCell>
                              {member.missedAttacks > 0 ? (
                                <span className="text-red-400 font-bold">{member.missedAttacks}</span>
                              ) : (
                                <span className="text-green-400 font-bold">0</span>
                              )}
                            </TableCell>
                            <TableCell className="text-blue-200">
                              {(
                                member.attacks.reduce((sum, attack) => sum + attack.attackScore, 0) /
                                member.attacks.length
                              ).toFixed(1)}
                            </TableCell>
                            <TableCell>
                              <span
                                className={
                                  member.finalScore > 0
                                    ? "text-green-400 font-bold text-lg"
                                    : "text-red-400 font-bold text-lg"
                                }
                              >
                                {member.finalScore.toFixed(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {index < 8 ? (
                                <Badge className="bg-green-600 text-white font-bold">⭐ YES</Badge>
                              ) : (
                                <Badge className="bg-red-600 text-white">❌ NO</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Attack Details */}
                <div className="grid gap-6">
                  <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                    🗡️ Individual Battle Analysis
                  </h4>
                  {clanData.map((member) => (
                    <Card
                      key={member.name}
                      className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-yellow-300 flex items-center gap-2">
                            {member.rank === 1 && <Crown className="h-5 w-5" />}
                            {member.name} (TH{member.townHall})
                          </span>
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 font-bold">
                            Rank #{member.rank}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {member.attacks.map((attack, attackIndex) => (
                            <div
                              key={attackIndex}
                              className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-blue-500/20"
                            >
                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                  <Star className="h-5 w-5 text-yellow-400" />
                                  <span className="text-yellow-300 font-bold text-lg">{attack.stars}/3</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Zap className="h-5 w-5 text-red-400" />
                                  <span className="text-red-300 font-bold">{attack.destructionPercentage}%</span>
                                </div>
                                <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                  vs TH{attack.opponentTownHall}
                                </Badge>
                                {getMultiplierBadge(calculateTHMultiplier(member.townHall, attack.opponentTownHall))}
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-xl text-green-400">⚔️ {attack.attackScore}</div>
                                <div className="text-sm text-blue-300">
                                  Multiplier: {calculateTHMultiplier(member.townHall, attack.opponentTownHall)}x
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30">
                <CardContent className="text-center py-12">
                  <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-slate-600 to-slate-700 p-6 rounded-full">
                      <Trophy className="h-16 w-16 text-slate-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-300 mb-3">No Battle Data Available</h3>
                  <p className="text-slate-400 mb-6 text-lg">
                    Please gather clan intelligence or upload battle records to see warrior rankings.
                  </p>
                  <Button
                    onClick={() => setActiveTab("input")}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-slate-900 font-bold"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Gather Intelligence
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="formula" className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-yellow-300 text-2xl">⚔️ Sacred War Algorithm ⚔️</CardTitle>
                <CardDescription className="text-blue-200 text-lg">
                  The mathematical formula that brings justice to the battlefield
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-bold mb-3 text-xl text-red-300 flex items-center gap-2">
                    <Swords className="w-5 h-5" />
                    Step 1: Calculate Battle Score
                  </h4>
                  <div className="bg-slate-900/80 p-6 rounded-lg font-mono text-sm mb-4 border border-red-500/30">
                    <span className="text-yellow-300">
                      Attack Score = [(Stars ÷ 3) × 0.75 + (Destruction% ÷ 100) × 0.25] × TH_Multiplier + 100
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Each battle is scored based on stars earned (75% weight) and destruction dealt (25% weight), then
                    adjusted by the town hall difference multiplier to reward brave attacks.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold mb-3 text-xl text-purple-300 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Step 2: Town Hall Battle Multipliers
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg border border-green-500/30">
                      <h5 className="text-green-300 font-bold">🏆 Heroic Attacks</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Attack +2 TH:</span>
                          <Badge className="bg-green-600 text-white font-bold">1.30x HERO</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Attack +1 TH:</span>
                          <Badge className="bg-green-500 text-white font-bold">1.15x BRAVE</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Attack same TH:</span>
                          <Badge className="bg-blue-500 text-white font-bold">1.00x FAIR</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg border border-red-500/30">
                      <h5 className="text-red-300 font-bold">💀 Cowardly Attacks</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Attack -1 TH:</span>
                          <Badge className="bg-orange-500 text-white font-bold">0.85x WEAK</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Attack -2 TH:</span>
                          <Badge className="bg-red-500 text-white font-bold">0.70x COWARD</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3 text-xl text-yellow-300 flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Step 3: Final Warrior Score
                  </h4>
                  <div className="bg-slate-900/80 p-6 rounded-lg font-mono text-sm mb-4 border border-yellow-500/30">
                    <span className="text-yellow-300">
                      Final Score = (Average Attack Score) × log₇(Wars Participated) - (Missed Attacks × 100)
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    The average battle score is multiplied by the loyalty multiplier (log base 7), then brutally
                    penalized for desertion (-100 per missed attack).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold mb-3 text-xl text-blue-300 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Key Battle Features
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-3 text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-blue-500/30">
                      <li className="flex items-center gap-3">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>75% weight on stars earned</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-red-400" />
                        <span>25% weight on destruction dealt</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span>Rewards attacking stronger opponents</span>
                      </li>
                    </ul>
                    <ul className="space-y-3 text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-purple-500/30">
                      <li className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span>Punishes attacking weaker bases</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span>Logarithmic participation rewards</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Swords className="w-4 h-4 text-red-400" />
                        <span>-100 penalty per missed attack</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
