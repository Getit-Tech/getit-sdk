# **Getit ad plugin**

## Installation

To get started with the getit ad plugin you need to download it from npm or yarn.

```
npm install getit-sdk
```

```
yarn add getit-sdk
```

## Usage

Once the package is in your project, simply import it from your folder

```
import { GetitAdPlugin } from "getit-sdk";
```

Then insert the Getit plugin whereever you see fit. Note that, for maximum compatibility, we now use 728x90 banners for desktop and 270x90 for mobile screens.

```
<GetitAdPlugin
    apiKey="xxx_xxx_xxx"
    walletConnected={address ? address : ""}
    isMobile={false | true}
    slotId="number as string"
/>
```

These 4 params are required:

1. ```apiKey``` - will be given to you by the Getit team, it should be stored in privately.
2. ```walletConnected``` - here you should pass the connected wallet's address in the Ethereum format. Or nothing if the wallet is not connected.
3. ```isMobile``` - this is the resolution param. If it is true - return mobile size image, else - desktop. It can always be true, if you need an ad to always display in the mobile format, regardless of the actual user's screen size.
4. ```slotId``` - the enumerator for the banner. If you are using multiple banners the number should be incremented by +1 for each next banner.

That's it. Once the plugin is installed, and you are activated within our system, you will start receiving ads to display to each user visiting your site.

## Clicks tracking

To track clicks on ad banners, we are using POST request and generating a redirect URL:

```
const urlToRedirect = redirect +
    "?utm_campaign=" +
    campaign_name +
    "&" +
    "utm_content=" +
    bannerName +
    "&" +
    "utm_source=" +
    "getit",
```

1. ```redirect``` - this is the URL of the advertiser's website
2. ```campaign_name``` - this is the name of the ad campaign the clicked banner belongs to
3. ```utm_content``` - name of the banner a user clicked
4. ```utm_source``` - URL of the publisher's site

This allows us to collect the clicks analytics per publisher as well as per banner within that publisher's site.
