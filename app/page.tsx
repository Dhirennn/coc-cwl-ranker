import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Trophy, Users, Calculator, Star, Target, TrendingUp, Swords, Crown, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-yellow-600/30 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-10 w-10 text-yellow-400 drop-shadow-lg" />
              <Crown className="h-5 w-5 text-yellow-300 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-yellow-400 drop-shadow-lg">CWL War Council</h1>
              <p className="text-xs text-blue-300">Fair Bonus Distribution</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#battle-strategy" className="text-blue-200 hover:text-yellow-400 transition-colors font-medium">
              Battle Strategy
            </Link>
            <Link href="#war-formula" className="text-blue-200 hover:text-yellow-400 transition-colors font-medium">
              War Formula
            </Link>
            <Link href="/ranker" className="text-blue-200 hover:text-yellow-400 transition-colors font-medium">
              War Room
            </Link>
          </nav>
          <Link href="/ranker">
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold shadow-lg border border-yellow-400">
              Enter War Room
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge
            variant="outline"
            className="mb-6 border-yellow-400/50 text-yellow-300 bg-slate-800/50 backdrop-blur-sm px-4 py-2"
          >
            <Swords className="w-4 h-4 mr-2" />
            Legendary War Algorithm
          </Badge>
          <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-6 drop-shadow-2xl">
            End the Bonus Wars
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
            No more favoritism! No more alt account bonuses! Our battle-tested algorithm ranks your clan warriors based
            on
            <span className="text-yellow-300 font-semibold"> skill, strategy, and dedication</span> - not politics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ranker">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-slate-900 font-bold text-lg px-8 py-4 shadow-xl border-2 border-yellow-400"
              >
                <Trophy className="mr-2 h-6 w-6" />
                Rank Your Clan
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 bg-slate-800/50 border-2 border-blue-400 text-blue-200 hover:bg-slate-700/50 hover:text-yellow-300 backdrop-blur-sm"
            >
              <Calculator className="mr-2 h-6 w-6" />
              Study the Formula
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
            Why Our War Council Rules
          </h3>
          <p className="text-center text-blue-200 mb-12 text-lg">The most advanced CWL ranking system in the realm</p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20">
              <CardHeader>
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-full w-fit mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-yellow-300">Strategic Warfare</CardTitle>
                <CardDescription className="text-blue-200">
                  Rewards attacking up, punishes attacking down
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Our Town Hall Difference Multiplier encourages brave warriors to attack stronger opponents and
                  discourages the cowardly "attack low for easy stars" strategy.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20">
              <CardHeader>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-full w-fit mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-yellow-300">Loyalty Rewards</CardTitle>
                <CardDescription className="text-blue-200">Logarithmic participation multiplier</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Using log₇(wars participated), we reward loyal clan members who show up for battle while still giving
                  chances to warriors who miss an occasional war.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20">
              <CardHeader>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-full w-fit mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-yellow-300">Balanced Combat</CardTitle>
                <CardDescription className="text-blue-200">75% stars, 25% destruction</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Stars win wars, but destruction matters too. No more rage over 99% one-star attacks - our algorithm
                  recognizes both victory and devastation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="battle-strategy" className="py-16 px-4 bg-gradient-to-r from-slate-900 to-blue-900">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
            Battle Strategy
          </h3>
          <p className="text-center text-blue-200 mb-12 text-lg">How our war algorithm conquers unfairness</p>
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg">
                1
              </div>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-blue-500/30 flex-1">
                <h4 className="text-2xl font-semibold mb-3 text-yellow-300">Calculate Battle Scores</h4>
                <p className="text-slate-300 leading-relaxed">
                  Each attack receives a combat score based on stars earned (75% weight) and destruction dealt (25%
                  weight), then amplified or reduced by the Town Hall difference multiplier - rewarding brave attacks on
                  stronger bases.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg">
                2
              </div>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-blue-500/30 flex-1">
                <h4 className="text-2xl font-semibold mb-3 text-yellow-300">Apply Loyalty Multiplier</h4>
                <p className="text-slate-300 leading-relaxed">
                  Average battle scores are multiplied by log₇(wars participated) to reward consistent clan loyalty
                  without completely banishing warriors who miss some battles due to real-life obligations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg">
                3
              </div>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-blue-500/30 flex-1">
                <h4 className="text-2xl font-semibold mb-3 text-yellow-300">Punishment for Desertion</h4>
                <p className="text-slate-300 leading-relaxed">
                  Each missed attack results in a brutal -100 point penalty, making participation crucial for bonus
                  eligibility while still allowing redemption from a single missed attack with exceptional performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formula Section */}
      <section id="war-formula" className="py-16 px-4 bg-slate-800/30">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
            The Sacred War Formula
          </h3>
          <p className="text-center text-blue-200 mb-12 text-lg">Mathematics that brings justice to the battlefield</p>
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-400/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-yellow-300">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-2 rounded-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                Battle Score Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-900/80 p-6 rounded-lg border border-blue-500/30 font-mono text-sm">
                <p className="text-yellow-300 font-bold mb-2">⚔️ Attack Score =</p>
                <p className="ml-4 text-blue-200">[(Stars ÷ 3) × 0.75 + (Destruction% × 0.25)] × TH_Multiplier + 100</p>
                <br />
                <p className="text-yellow-300 font-bold mb-2">🏆 Final Warrior Score =</p>
                <p className="ml-4 text-blue-200">
                  (Average Attack Score) × log₇(Wars Participated) - (Missed Attacks × 100)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-red-500/30">
                  <h5 className="font-bold mb-3 text-red-300 flex items-center gap-2">
                    <Swords className="w-4 h-4" />
                    Town Hall Multipliers:
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex justify-between">
                      <span>Attack +2 TH:</span>
                      <Badge className="bg-green-600 text-white">1.3x Hero Bonus</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>Attack +1 TH:</span>
                      <Badge className="bg-green-500 text-white">1.15x Brave</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>Attack same TH:</span>
                      <Badge className="bg-blue-500 text-white">1.0x Fair</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>Attack -1 TH:</span>
                      <Badge className="bg-orange-500 text-white">0.85x Weak</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>Attack -2 TH:</span>
                      <Badge className="bg-red-500 text-white">0.7x Coward</Badge>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-yellow-500/30">
                  <h5 className="font-bold mb-3 text-yellow-300 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Key Battle Features:
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-400" />
                      75% weight on stars earned
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-blue-400" />
                      25% weight on destruction
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-purple-400" />
                      Logarithmic participation bonus
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-red-400" />
                      -100 penalty per missed attack
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <h3 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">Ready to Bring Justice to Your Clan?</h3>
          <p className="text-xl mb-8 text-yellow-100 leading-relaxed">
            Connect your clan using the Clash of Clans API and let our battle-tested algorithm determine who truly
            deserves those precious CWL bonuses. No more politics, just pure performance.
          </p>
          <Link href="/ranker">
            <Button
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-yellow-400 font-bold text-lg px-8 py-4 shadow-2xl border-2 border-yellow-400"
            >
              <TrendingUp className="mr-2 h-6 w-6" />
              Enter the War Room
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 border-t border-yellow-600/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <Shield className="h-8 w-8 text-yellow-400" />
                  <Crown className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1" />
                </div>
                <div>
                  <span className="text-xl font-bold text-yellow-400">CWL War Council</span>
                  <p className="text-xs text-blue-300">Fair Bonus Distribution</p>
                </div>
              </div>
              <p className="text-slate-400">
                Bringing mathematical justice to Clan War League bonus distribution across the realm.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-yellow-300">Battle Features</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <Swords className="w-3 h-3" />
                  Strategic Attack Scoring
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  Loyalty Participation Rewards
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Town Hall Balancing
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  API Integration
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-yellow-300">War Algorithm</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <Calculator className="w-3 h-3" />
                  Mathematical Formula
                </li>
                <li className="flex items-center gap-2">
                  <Trophy className="w-3 h-3" />
                  Transparent Scoring
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-3 h-3" />
                  Fair Distribution
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3" />
                  Performance Based
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-500">
            <p>&copy; 2024 CWL War Council. Built for fair clan management. Not affiliated with Supercell.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
