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
Add this to your Render environment variables:

```bash
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
```

**On Render Dashboard:**
1. Go to your service → Environment
2. Add new environment variable
3. Key: `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
4. Value: `ca-pub-your-actual-publisher-id`

### Step 4: Create Ad Units
In your AdSense dashboard, create these ad units:

#### Top Banner (728x90)
- **Name**: "CWL Ranker Top Banner"
- **Type**: Display ads
- **Size**: 728x90 (Leaderboard)
- **Copy the Ad Slot ID**: Replace `"1234567890"` in the code

#### Middle Rectangle (300x250)
- **Name**: "CWL Ranker Middle Rectangle"  
- **Type**: Display ads
- **Size**: 300x250 (Medium Rectangle)
- **Copy the Ad Slot ID**: Replace `"0987654321"` in the code

#### Bottom Banner (728x90)
- **Name**: "CWL Ranker Bottom Banner"
- **Type**: Display ads
- **Size**: 728x90 (Leaderboard)
- **Copy the Ad Slot ID**: Replace `"1357924680"` in the code

### Step 5: Update Ad Slot IDs
Edit `app/ranker/page.tsx` and replace the placeholder ad slots:

```typescript
// Top Banner - Replace this:
adSlot="1234567890" 
// With your actual ad slot ID:
adSlot="your-top-banner-slot-id"

// Middle Rectangle - Replace this:
adSlot="0987654321"
// With your actual ad slot ID:
adSlot="your-middle-rectangle-slot-id"

// Bottom Banner - Replace this:
adSlot="1357924680"
// With your actual ad slot ID:  
adSlot="your-bottom-banner-slot-id"
```

## 📊 Ad Placement Strategy

### Current Ad Placements:
1. **Top Banner** (728x90): Above the input form - high visibility
2. **Middle Rectangle** (300x250): Between input and results - catches attention
3. **Bottom Banner** (728x90): After results table - users who complete the ranking

### Best Practices:
- **Above the fold**: Top banner gets highest CTR
- **Content separation**: Middle ad separates form from results naturally
- **Completion reward**: Bottom ad targets engaged users who got results

## 💡 Alternative Ad Networks

### If AdSense rejects you:
1. **Media.net** - Yahoo/Bing powered ads
2. **PropellerAds** - Pop-unders and push notifications
3. **AdThrive** - Premium network (requires 100k monthly pageviews)
4. **Mediavine** - Another premium option (50k monthly sessions)

### Gaming-Specific Networks:
1. **Unity Ads** - Mobile gaming focused
2. **IronSource** - Gaming and mobile apps
3. **AdMob** - If you create a mobile app version

## 🔧 Testing Your Setup

### Development Testing:
- Ads show as gray placeholder boxes locally
- Text reads "AdSense ads will appear here in production"

### Production Testing:
1. Deploy to Render with your AdSense ID
2. Wait 1-2 hours for ads to appear
3. Check browser console for any errors
4. Use browser dev tools to verify ad script loads

### Troubleshooting:
- **No ads showing**: Check environment variable spelling
- **Console errors**: Verify Publisher ID format
- **Ad policy issues**: Ensure content complies with AdSense policies

## 📈 Revenue Optimization Tips

### Content Strategy:
1. **Add more pages**: Create guides, tier lists, strategy content
2. **SEO optimization**: Target "clash of clans cwl" keywords
3. **Regular updates**: Keep content fresh for return visitors

### Traffic Growth:
1. **Reddit**: Share in r/ClashOfClans (follow rules)
2. **Discord**: Join CoC Discord servers and share tool
3. **YouTube**: Create tutorial videos showing the tool
4. **Social media**: Twitter, TikTok gaming content

### Ad Optimization:
1. **Monitor performance**: Check which ads perform best
2. **A/B test**: Try different ad sizes and placements
3. **Responsive ads**: Consider auto-sized responsive units
4. **Page load speed**: Ensure ads don't slow down the site

## 💵 Revenue Expectations

### Conservative Estimates:
- **100 daily users**: $1-5/day
- **500 daily users**: $5-25/day  
- **1,000 daily users**: $10-50/day
- **5,000 daily users**: $50-250/day

### Factors Affecting Revenue:
- **Geography**: US/UK traffic pays more
- **Device**: Mobile vs desktop
- **Engagement**: Time spent on site
- **Seasonality**: CWL seasons = traffic spikes

## 🛡️ Important Notes

### AdSense Policies:
- No clicking your own ads
- No asking users to click ads
- No misleading content
- Keep content family-friendly
- Respect user privacy (GDPR compliance)

### Performance:
- Monitor site speed with ads
- Use lazy loading for below-fold ads
- Consider ad blockers (20-30% of users)

### Legal:
- Add Privacy Policy (required for ads)
- Cookie consent for EU users
- Terms of Service recommended

Ready to start earning from your awesome CWL tool! 🚀💰 