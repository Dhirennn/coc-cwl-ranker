# 💰 Monetization Setup Guide - CWL Ranker

This guide will help you add ads to your CWL Ranker and start earning revenue from your Clash of Clans tool.

## 🎯 Ad Revenue Potential

Your CWL Ranker targets a specific gaming audience (Clash of Clans players), which can be quite valuable:
- **Gaming niche**: $2-8 RPM (Revenue Per Mille impressions)
- **Mobile gaming**: Often higher engagement and click rates
- **Tool-based sites**: Users spend more time = more ad impressions

## 🚀 Google AdSense Setup (Recommended)

### Step 1: Apply for AdSense
1. Visit [Google AdSense](https://www.google.com/adsense/)
2. Sign up with your Google account
3. Add your website: `https://clashwarcouncil.com`
4. Choose your country and currency
5. Wait for approval (1-14 days typically)

### Step 2: Get Your Publisher ID
After approval, you'll get a Publisher ID like: `ca-pub-1234567890123456`

### Step 3: Configure Environment Variables

**On your hosting platform (Render):**
1. Go to Environment Variables
2. Add: `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-4074522008297476` (use your actual ID)
3. Redeploy your service

**For local development, create `.env.local`:**
```bash
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-4074522008297476
```

### Step 4: Update API Key Instructions

Since you're now using **RoyaleAPI proxy** (much simpler than Render static IPs):

**For your users:**
1. Visit [Clash of Clans Developer Portal](https://developer.clashofclans.com)
2. Create API key with **single IP**: `45.79.218.79`
3. Use your tool normally

**Benefits of RoyaleAPI proxy:**
- ✅ Single IP to whitelist (45.79.218.79)
- ✅ No dependency on hosting provider's IP management
- ✅ More reliable than static IP services
- ✅ Simpler setup for users

## 🎯 Ad Placement Strategy

Your CWL Ranker has **strategic ad placements**:

### **1. Top Banner Ad**
- **Location**: Above input form
- **Size**: 728x90 leaderboard
- **Audience**: Fresh visitors setting up their ranking

### **2. Middle Rectangle Ad**  
- **Location**: Between input and results
- **Size**: 300x250 rectangle
- **Audience**: Users who are engaged and waiting for results

### **3. Bottom Banner Ad**
- **Location**: After results table
- **Size**: 728x90 leaderboard  
- **Audience**: Users who got value and might bookmark/return

## 💡 Revenue Optimization Tips

### **Content Strategy**
- Add blog posts about CWL strategies
- Create guides on optimal attacking
- Add TH progression guides
- More pages = more ad impressions

### **User Engagement**
- Add "Save Results" feature (return visits)
- Email notifications for CWL seasons
- Discord integration for clans
- Bookmark-worthy content

### **Technical Optimizations**
- Enable analytics to track user behavior
- A/B test ad positions
- Optimize Core Web Vitals for better ad performance
- Add lazy loading for ads below fold

## 📊 Expected Revenue

**Conservative estimates for CWL Ranker:**
- **Gaming niche**: $3-6 RPM
- **100 daily users**: ~300 page views
- **Monthly revenue**: $30-100 (varies by traffic quality)

**Growth strategies:**
- SEO for "CWL ranking", "Clash of Clans tools"
- Share in Clash of Clans Discord servers
- Reddit communities (/r/ClashOfClans)
- YouTube tool reviews

## 🔧 Technical Implementation

Your ads are **already configured** with:
- ✅ AdSense script in layout
- ✅ Responsive ad components
- ✅ Development/production handling
- ✅ Privacy policy compliance
- ✅ ads.txt file

## 📋 Next Steps

1. **Deploy current changes**
2. **Update your API key** to use RoyaleAPI proxy IP: `45.79.218.79`
3. **Apply for AdSense** (takes 1-14 days)
4. **Add your Publisher ID** to environment variables
5. **Start earning** from your Clash of Clans tool! 