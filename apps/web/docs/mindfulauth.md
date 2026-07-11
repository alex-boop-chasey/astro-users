Chapter 1: Intro to Mindful Auth and Vendor Lock-in
0:00Today I saw a post on the AstroJS already regarding how are you handling odd in Astro projects and I wanted to
0:099 secondsmake this quick demo video of the odd system I created for Astro which is called Mindful O and Mindful O is
0:1717 secondscurrently optimized to run from Cloudflare workers Astro 6 and the user data leaves in your Cloudflare D1 once
0:2525 secondsand looking at the community comments the most recommended a system is clerk which is fantastic. Uh but there's a
0:3333 secondscomment here that interests me. It says from flex RC is good to know not worry about vendor lock in. And that is
0:4141 secondsexactly why I created mindful ad. I did not want to give my users and clients data to some external service I don't
0:4848 secondsreally trust and then probably be locking in some ridiculous fees and have a nightmare trying to migrate if at all
0:5656 secondspossible. So you see the mindful art simply authenticates and validates the sessions at the edge via Cloudflare
1:041 minute, 4 secondsworkers and KB. And here's a simple illustration of how it works. So here's your application. You have the front
1:121 minute, 12 secondsend, the back end and the database are all yours. You are in control of that and Mindful simply interacts with your back end. So here's the flow. The front
1:211 minute, 21 secondsend sends the credential to your back end. Then the backends calls the mindful odd API for the validations and the mindful validates the authentications
1:301 minute, 30 secondsand then the back end receives it either a success or a failure response and the back end stores the member data in your
1:381 minute, 38 secondsdatabase. So, Mindful Lot never sees or stores members data. And I'm going to show you a quick demo of how easy it is
1:461 minute, 46 secondsto set up with Astro 6 using the Cloudflare D1 as your back end and running from Cloudflare workers. And all
1:541 minute, 54 secondsof this can be done in eight simple step. So, let's go back to the documentation and we're going to go here to the setup. Okay. So, the first step
2:032 minutes, 3 secondsis we're going to be creating a Mindful account. Just go to appammindful.com and then you're going to be registering
2:102 minutes, 10 secondsuse your name, email, password and then com after that you're going to be verifying your email and then you're going to be logging in from the portal
Chapter 2: How the Authentication Flow Works
2:182 minutes, 18 secondswhich is app.mmindful.com and when you're in there you will see something like this. This is my own portal but we're not going to be
2:262 minutes, 26 secondstouching this for now. Let's uh actually go and create the Astro uh portal. So
2:332 minutes, 33 secondslet's go back to the um setup and we're going to go to the step two which is the setup front end and currently my fold
2:402 minutes, 40 secondsout is optimized for Astro 6. So let's going to click here and let's just go to the setup guide here and we're going to
2:472 minutes, 47 secondsrun this mpm command which will install the mindful uh template which is right
2:532 minutes, 53 secondshere. And let me just copy and let's go to um yep to and let's open the terminal
3:013 minutes, 1 secondand we're gonna paste this to create the Astro 6 mindful art template and let's
3:103 minutes, 10 secondsput some name on this. Let me just put example mindful art for odd. Perfect. And then installing
3:183 minutes, 18 secondsthe dependencies. Yes, I don't really need a git for this one. And then it's going to installing with the dependencies. Excellent. So everything
3:273 minutes, 27 secondswas installed correctly. Let me just go over a brief overview of what is in here. Uh if we go to the documentation, you're going to see like the setup
3:353 minutes, 35 secondsguide. It will tell you how to set it up, which is what we already did. And if we go to the configuration, you will see that uh we have authentication pages,
3:443 minutes, 44 secondsstatic pages, protect the root, and all stuff like that. Let me actually show you what it is. So in here when you go
3:503 minutes, 50 secondsto source you got in here in pages all the authentication pages. So it's going to be the login the magic login the
3:583 minutes, 58 secondsmagic register register and so on. And in this one over here the member ID is this is where the secure pages are for
4:064 minutes, 6 secondsso example you have member ID that dashboard will contain all the information u authenticated by that
4:124 minutes, 12 secondsspecific member ID. So if I go down here you will see let's go to the login and
4:204 minutes, 20 secondsyou will see a couple of components here like m o form m email input mount password input. If you go back to the
4:284 minutes, 28 secondsdocumentation over here you can see the component reference here and there are a few of them. First we got the layouts which is mount public which is used for
4:374 minutes, 37 secondsthe authentication pages login register for we got password and so on and you need to follow this format and then we
4:444 minutes, 44 secondsgot the form components for each of them and each component has different things that you can do with them different properties you all of them have classes
Chapter 3: Setting Up the Astro 6 Template
4:524 minutes, 52 secondsso you can uh do the design however you like with any CSS classes as a wrapper element. So all those are all the
5:005 minutescomponents here and if you go to page examples you will be able to see all the pages that the uh template has. You can
5:075 minutes, 7 secondsgo also in the templates that are available. One thing I want to mention that is when you're using mindful you need to use this layout the mop mount
5:165 minutes, 16 secondspublic for the authentication pages and in the secure pages you're going to be using the mout protected and as you can
5:235 minutes, 23 secondssee here the protected layout is a custom layout that I have over here. you can um grab the mount protected layout
5:315 minutes, 31 secondsinside any of your layouts so you have full control of what you want in your layouts and design. So let me go back
5:395 minutes, 39 secondshere and go to the login and let's actually do an MPM rundev so you can see a preview and then
5:495 minutes, 49 secondsthere we go. I'm going to run local host and as you can see this is how it looks just a simple login. You can actually
5:565 minutes, 56 secondspreview it and change it however you like. So let's say that you want to change something here. You're going to go here and anything you like. Hello for
6:056 minutes, 5 secondsexample. Click save and it's going to change directly here. And one thing about uh one thing about mindful out if
6:136 minutes, 13 secondsyou see here is this member ID. And the member ID is that where you put all the pages that you want authenticated.
6:196 minutes, 19 secondsMindful will go over all that folders and authenticate the pages. So, let me show you what that is. If you go to the
6:286 minutes, 28 secondsum local host preview, you're going to go out here and let's say that your users ID is 1 2 3 4 5 and when you click
6:366 minutes, 36 secondsthat, they will be redirected to the dashboard. So, in a real website that is um not in the local host, the any unless
6:466 minutes, 46 secondsthe person authenticates and login using their username and password or magically, they won't be able to see this. that middleware will stop it when
6:546 minutes, 54 secondsthe an unauthorized users tries to log into this page. So that's it. Um in here it's just pretty straightforward. For
7:027 minutes, 2 secondsexample, you have here the static page which will be over here a static static page. You can change it however you
7:107 minutes, 10 secondslike. And in here in profile you got several different options to change the password, enabling two factor authentication and doing the
7:177 minutes, 17 secondsauthentication methods which is password and magic link currently. Let me actually show you that over here which is index which is a very simple uh
7:267 minutes, 26 secondscomponent from mindful app to put the chain password enabled to factor authentication and disable and add method. Like I mentioned before you can
Chapter 4: Component Reference and Layouts
7:347 minutes, 34 secondsgo to the documentation over here in component reference and in the security section components you can see what each property does and how you can change it.
7:447 minutes, 44 secondsUh currently this is a mindful is in the beta phase. So this part here about the classes, I'm still looking how to work
7:527 minutes, 52 secondson it because my goal with Mindful is that you have full flexibility of the design. So you can change it however you like by simply adding classes into these
8:008 minutescomponents. But let me know if you have issues with that because I'm very interesting to know how you do that your design elements, how you would like to
8:098 minutes, 9 secondsto do that. But you have full flexibility to do whatever you like with your design. Okay. Excellent. So let's go back to the visual studio code to see
8:178 minutes, 17 secondshere. Let's open a very important one which is packet-json. As you see are all the developer dependencies and you can
8:248 minutes, 24 secondssee this one which is mindful. Astro and you go to the node models and go mindful you will see what this uses the
8:328 minutes, 32 secondsauthentication scripts for each of the pages the components which are over here and you got the core which is what makes the authentication happen and the
8:418 minutes, 41 secondsmiddleware which is the most important one. this one and the layouts for mindful out protected and the mindful apps. You're going to explore that and
8:498 minutes, 49 secondsif you have any question just contact me. I'll be happy to explain all of them. Well, let me go back to the package.json and you guys all these
8:578 minutes, 57 secondsdependencies and then over here in the uh Astroconfig there are a couple of things here about mindful you can look
9:059 minutes, 5 secondsat the documentation to see what each and everybody does. But one thing I want to mention is for the adapt that is for Cloudflare workers in this example. And
9:149 minutes, 14 secondsway down here is the content security policy that is new to Astro 6. I have a video in the YouTube channel explaining
9:229 minutes, 22 secondswhat this is. You can go watch it and I go into very specific details. But one thing I want to mention when doing this
9:309 minutes, 30 secondsand if you go over here to the uh content security policy configuration in
9:389 minutes, 38 secondsthe documentation is that you can actually break the site with the content security policy. Just be very particular about how you're going to be setting this up because it will break your site.
9:489 minutes, 48 secondsIt's it's annoying but it's for the security of the site. You can actually disable it and mindful that will work.
9:549 minutes, 54 secondsBut I highly highly recommend that you use the content security policy to keep your site considerably more secure. So just keep that in mind. Okay, perfect.
10:0510 minutes, 5 secondsSo with that said, let's go back to the setup over here. So that's all we need to set up the front end. That's all we
10:1210 minutes, 12 secondsneed. And let me go before doing something, let me go to the uh granular.json. And I'm just going to
Chapter 5: Content Security Policy Configuration
10:2010 minutes, 20 secondschange the name here to example Mindful Site because this is the one that I'm going to publish.
10:3010 minutes, 30 secondsI go odd. Perfect. And then I'm going to change this to example.vm.com
10:4010 minutes, 40 secondsand then mindfulvm. Perfect. So this is the this is the route that the worker is going to be running from. is going to be running from example.mmindfulb.com
10:4810 minutes, 48 secondswith the same name mindfulbm.com which is one of the domains that I use for testing. Perfect. So the granular.json is correct and perfect. So that's good.
10:5910 minutes, 59 secondsSo now we need to go back. We set up the front end and then we're going to go to the setup the back end. So mindful
11:0511 minutes, 5 secondscurrently allows you to use tape and cloud 31. For this example, let's use cloud 31. I'm going to click here. I'm
11:1411 minutes, 14 secondsgoing to open that. And in Cloud Freddy, all we need to do is go to the D1 tables here. And you got two tables. The
11:2111 minutes, 21 secondsmembers or user tables and the audit logs. So, let's actually go to Cloudflare over here. And I already have
11:2911 minutes, 29 secondsa D1 uh table ready to add to create the tables. So, let's go here to the console and I'm going to go here. I'm going to
11:3711 minutes, 37 secondscopy this in here. The members going to go to here. going to paste it. I'm going to click execute. And perfect. It
11:4611 minutes, 46 secondsalready created that table the query successfully. Now let's go and create the audit logs table by copying here going back and clicking paste. Perfect.
11:5711 minutes, 57 secondsAnd the query was successful. So now let's explore the data. And you can see here that you got the members table
Chapter 6: Setting Up Cloudflare D1 Tables
12:0412 minutes, 4 secondswhich has a record ID, name, email, password, and a bunch of other stuff.
12:0912 minutes, 9 secondsand the audit logs which was used for specific audit events. Perfect. So now we got that set up. So that's all you
12:1712 minutes, 17 secondsneed to do to set up the back end. So let's go to the setup and then we got the get turn steel credential because
12:2312 minutes, 23 secondsMindful H uses turn to protect from bot attack. So you need you need both a turn steel secret key and a turn steel site
12:3212 minutes, 32 secondskey. So you can get that in the turn tool in Cloudflare. It's completely free. So just follow the instructions here and you will you will be able to
12:4012 minutes, 40 secondsgather that information. So the next step is to set up the email web hooks and you need to implement an email web
12:4812 minutes, 48 secondshook on your server. So mindful lot simply sends you a specific information which you can see here to verify the
12:5512 minutes, 55 secondsemail to do password reset and to do magic log in. So you need to provide uh the specific email that you want to do
13:0413 minutes, 4 secondsand you can use any any tool that you want like make.com or n or you can go to the template here and I
13:1413 minutes, 14 secondsprovide some thing if you go to the source and you go to lib email.ts it
13:2013 minutes, 20 secondsprovides you a way to do it using uh the postmark API. There's some documentation
13:2713 minutes, 27 secondson how to do that here in the front ends. If you go to email and web hbook integration in the Astro front end and we give you all the information on how
13:3613 minutes, 36 secondsto set this up and this will this is useful if you want to run the email verification from the Astro site as
13:4413 minutes, 44 secondswe're using Astro as the API call. So just explore it and and see if it works for you. But you can use any and any
13:5313 minutes, 53 secondsother tool that you like. You just need to know that this here the email web hook this is what mindful will send you
14:0014 minutesfor the verification link reset link and magic login and you can use it however you like.
14:0814 minutes, 8 secondsPerfect. So now the other step is to on board the host name and this is where we will go to the uh mindful odd portal. So
14:1514 minutes, 15 secondslet's do that and let's on board what we just created. So let's see and we're going to go here to the mindful odd and
14:2214 minutes, 22 secondsin here I'm going to click connect new portal. When you connect the new portal it's going to ask you to select which backend do you do you want to use. So
14:3014 minutes, 30 secondswe're going to use tape or cloud for D1 which are the two available. For this demonstration we're going to use cloud for D1. Once it's selected you're going
14:3914 minutes, 39 secondsto continue with doing the rest of the things. So the first thing we will do is it's going to ask me for the host names
Chapter 7: Turnstile and Email Webhook Integration
14:4614 minutes, 46 secondsand mindful only allows subdomains. So port example portal.exagample.com and you're going to do that for for this
14:5314 minutes, 53 secondsdemonstration I'm going to use example mindfulbia.com and the login success red URL. So what
15:0115 minutes, 1 secondis this? So whenever a user uh logs you need to send them somewhere you need to redirect them from the login page to
15:0815 minutes, 8 secondssomewhere else and you can do whatever Astro page that you created inside the member ID folder. So for my situation
15:1715 minutes, 17 secondsI'm going to be using dashboard and as you can see here the result will be member ID as dashboard and if we go
15:2415 minutes, 24 secondsback over here it will be this page member ID and dashboard. This is the page that the person will see when they
15:3415 minutes, 34 secondslog in. Perfect. So now the security settings, we're going to do the turn steal site key, the turn secret key. So
15:4115 minutes, 41 secondslet me add those real quick. And I got both of them. Then we continue with the session duration and the number of
15:4815 minutes, 48 secondsactive sessions. So the session duration as you can see here is the duration for which a session remains active. So this is how long you want the uh user to
15:5815 minutes, 58 secondsremain login in your system. You can go from 15 minutes all the way to 30 days.
16:0416 minutes, 4 secondsAnd I made this this way because it depends on the security that you want to provide. Let's say for example you're creating a portal for a lawyer or some
16:1216 minutes, 12 secondslegal um business. You want it to be very close maybe an hour or 15 minutes depending on the on the complexity and
16:2116 minutes, 21 secondsthe privacy that you want to provide. So this option is for that. For this demonstration, let's use seven days. And then we got the number of optic
16:2916 minutes, 29 secondssessions. And this is how many sessions you want active at the same time. So you can go from one, two, up to 10. I think
16:3716 minutes, 37 secondsthree is decent enough. So up to three devices. And then we got the audit logs.
16:4316 minutes, 43 secondsAnd this is an enterprise security and audit logs. If you go to the mindful documentation again and if you go over
16:5016 minutes, 50 secondshere to options you can see the audits logs and this is it monitors everything that is happening a detail record of all
16:5816 minutes, 58 secondsthe login and authentication thing that are happening on your site. This feature here or the audit locks is basically for like I mentioned before maybe a legal
17:0717 minutes, 7 secondsclient that you have. They they should have this because it give them information about what's going on and it's very very useful and very powerful.
17:1617 minutes, 16 secondsAnd I'm going to show it to you once uh we publish the portal. Perfect. So, let's go back and I'm gonna keep them active. And for the email web hook, like
17:2517 minutes, 25 secondsI mentioned, you can use uh anything you like, but for me, I'm just going to use one of the tape app, which is easier.
Chapter 8: Onboarding the Portal in the Dashboard
17:3417 minutes, 34 secondsAnd perfect. And now we got the cloud for D1 backend configuration. And these are all the things that I needed. Uh the
17:4317 minutes, 43 secondsD1 API token and account ID, the database ID, members table, email column, and the o and the other log
17:5017 minutes, 50 secondstable. So let's go one by one and let me add each one of them. Okay, perfect. So now we got everything here and we're
17:5817 minutes, 58 secondsready to on board the tenants. So let's just review. First you select the back end that you want which would be Cloudflare. You select the host name,
18:0618 minutes, 6 secondsthe login success redirect where you want the people your users to be redirected after login. You got the turn
18:1318 minutes, 13 secondsstill site key, your secret turn to secret key, the session duration, number of updation, if you want the audit locks activated, the email web hook, and the
18:2118 minutes, 21 secondsbacking configuration. Perfect. Once that's all is done, you're going to click on board tenant. And perfect. And once the tenant is uploaded, you will
18:2918 minutes, 29 secondssee down here that the tenant was on boarded successfully and your internal API key. Make sure you save this key
18:3718 minutes, 37 secondshere. And what is And so what is the internal API key? Let me go back to the mindful talks and we're going to go over
18:4518 minutes, 45 secondshere to the site key over here and the site key is a ML site key is a secret
18:5218 minutes, 52 secondskey used to authenticate requests made by the mindful API. So the way I designed Mindful is every portal that is
19:0019 minutesonboarded in mindful has a different API key. We can have hundreds of them with different API keys and this is a security feature. So no portal is equal.
19:0919 minutes, 9 secondsNo portal can be authenticated the same way. It needs to have its own API key.
19:1519 minutes, 15 secondsYou can get more information about here in the security if you go to uh pertenant key derivation. I explain in
19:2219 minutes, 22 secondsdetail all that is uh in here and how it works. Perfect. So, but for now, let's
19:2919 minutes, 29 secondsjust go over here and I'm going to do uh the site key and let me go to
19:3719 minutes, 37 secondsthe Cloudflare worker deployment here in the Astro because I'm going to need to put this API key over here in the
19:4519 minutes, 45 secondsCloudflare worker. But before doing that, let's actually deploy to workers.
19:4919 minutes, 49 secondsLet's actually do this. Uh let me make sure to go back to the Granular. Make sure everything is okay. Uh everything
19:5719 minutes, 57 secondslooks good as you see here. And then the granular looks okay and perfect. So
20:0320 minutes, 3 secondsexcellent. It looks good. So let me do mpm run build. Let's build the project.
20:1520 minutes, 15 secondsPerfect. And now I'm going to do mpx grangler deploy. And then I'm going to click enter. And then it's going to connect to my Cloudflare account via
20:2420 minutes, 24 secondsGranular. and it's going to deploy this portal directly to one of the workers.
20:2920 minutes, 29 secondsOkay, perfect. So the worker So the worker was deployed. So now the next step we need to do is to create the mout psyche. So let me go back over here and
20:3920 minutes, 39 secondsas you can see here M outsite key. So just copy this over here and from the terminal you're going to click here MPX
20:4720 minutes, 47 secondsuh MPX grangler secret put MOT site key click enter. It's going to enter the secret value and you're going to go
20:5420 minutes, 54 secondswhere you on board over here and you're going to copy this key over here and you're going to copy.
21:0221 minutes, 2 secondsLet's go over here. Going to enter the value. Click enter. It's going to creating. Perfect. M outside key was created. And just in case you missed the
21:1121 minutes, 11 secondsuh M outside key, you can actually go back here. If you go to your dashboard and if you're going to be able to see
Chapter 9: Deploying to Cloudflare Workers
21:1821 minutes, 18 secondsall your portals over here. So you can see example mindfulbm just click edit and if you scroll all the way down here
21:2621 minutes, 26 secondsyou will be able to see your portal site key here you can show it as you can see here and you can copy it directly from
21:3421 minutes, 34 secondshere and perfect. So now we got that and everything was deployed correctly and
21:4121 minutes, 41 secondslet's go to the workers to see if it deployed and here it is in the example
21:4821 minutes, 48 secondsthat mindfulbn.com my example mindful I go to settings you can see that the M outside key was added
21:5521 minutes, 55 secondsas a variable and the secret and perfect everything is looking fantastic. So now let's actually go to example.mmindfulbn.com
22:0422 minutes, 4 secondsand if I go there you can see here that the portal was created with the hello that I forgot to remove but it's fine
22:1222 minutes, 12 secondsand perfect. So now as you can see here is um the turn still is working and you got the email and the password and now
22:2022 minutes, 20 secondsif we go to the cloud for D1 you got the members and the audit logs. So at the moment I don't have any members. So I
22:2922 minutes, 29 secondsactually need to create one. So let's actually do that. So if you go once the portal is um is published you can the your users can start using the portal
22:3822 minutes, 38 secondsand registering to the cloud for D1. And to do that they are going to go to the create an account and let's say they're
22:4622 minutes, 46 secondsgoing to their name is yond do yond do atmymail.com and then a password. Let me just create a random password. one password.
22:5622 minutes, 56 secondsPerfect. And now after I have the password, you're going to be create the account. And it's creating the account.
23:0323 minutes, 3 secondsSo it says account created. Please check your email to verify your account. So when that happens, you're going to go to the cloud for D1. And let's just refresh
23:1223 minutes, 12 secondsthe table. And you will be able to see that that um member was created John Doe with the email and it created I'm
23:1923 minutes, 19 secondsmindful I created a password hatch a password salt and the authentication method uh is going to be password and in the authentication status you're going
23:2723 minutes, 27 secondsto see email verification pending and a couple of other stuff. So now the user needs to verify that email. So let me do
23:3623 minutes, 36 secondsthat. And I think I did it over here. So this is tape. This is T but it's the same that depends on the platform that they're using to receive the email web
23:4523 minutes, 45 secondshooks. Just use whatever is comfortable for you. But I'm using T for simplicity.
23:5023 minutes, 50 secondsSo this is what they will receive. This is the payload that is received. As you can see here, it says like verify email. The record ID is this one A1 949.
24:0224 minutes, 2 secondsAnd if we go to the D1 table, you can see here A1949. So this is about this user. and then the email name and
24:1124 minutes, 11 secondsverification link. And with this information, you can create um the email however you like. In the case of tape,
24:1824 minutes, 18 secondsyou can see here that I I have like the tiny MCE to create the email verification and send it when needed.
24:2524 minutes, 25 secondsBut in this scenario, I'm just deactivating this because I only need this verification link. So over here,
Chapter 10: Live Demo: Registration and Verification
24:3224 minutes, 32 secondsgoing to copy this link. Did I copy it correctly? Yes. I want to make sure.
24:3824 minutes, 38 secondsCopy. And now I'm going to go and open it in a new tab. And you can see email verification. Email verify successfully.
24:4624 minutes, 46 secondsYou can now log to your account. So I want to show you what happens in the D1 back end. So let's go over to D1. And as
24:5624 minutes, 56 secondsyou can see here, let's this is the current state. Email verification pending. And now if I refresh here, you're going to see that this status
25:0425 minutes, 4 secondschanged to unlock. So what that means is that now the user can uh go in in and
25:1125 minutes, 11 secondsloging into your portal. So mindful checks for the authentication status unlock to let the user in. You can
25:1925 minutes, 19 secondsactually manually uh change the authentication status here directly in the D1 database. Although I don't recommend that you do that because you
25:2625 minutes, 26 secondswant the person that your members to verify their email themselves so they authenticate themselves with real
25:3425 minutes, 34 secondsaccounts. you have the option to do that. And if you go to the um documentation here in the tape template, you can actually see all the statuses.
25:4225 minutes, 42 secondsIt's going to be unlock, lock, password change pending, and email verification pending. These are the status for the authentication status categories.
25:5125 minutes, 51 secondsPerfect. And excellent. So now I can log in. So let's go over here and let's use my trusty one password. And I think it's
26:0026 minutesthis one. Yep, this one. So, let me uh so perfect and I'm going to click auto
26:0726 minutes, 7 secondsfield and you're going to see John email and then I'm going to click login and it's verifying success and boom you
26:1426 minutes, 14 secondsalready have your secure pter portal and over here as you can see it's running from Astro and the statics page and you
26:2126 minutes, 21 secondscan see your profile and all that and because it's run and the reason and because it's running from cloud 41 is
26:3026 minutes, 30 secondsreally really fast. Uh the one that I showed you from my own um this one over here is a little slower because it's
26:3826 minutes, 38 secondsrunning from tape and the tape API is slightly slower. D1 is crazy fast. So depending on your situation on what
26:4526 minutes, 45 secondsyou're looking for, select D1 depending on what you need. But um this depends on your preference and your client's
26:5226 minutes, 52 secondspreference. Okay, perfect. So now I got the portal. So, let me do one additional thing is I'm going to go to profile and
26:5926 minutes, 59 secondsI'm going to actually enable the two factor authentication. I'm going to go here, click enable two factor authentication and it's going to create
27:0727 minutes, 7 secondsthe QR code and I'm going to go to this one and save the authentication code.
27:1527 minutes, 15 secondsPerfect. um one password created the uh digit codes and I'm going to verify and enable and it's going to create the uh
27:2327 minutes, 23 secondsrecovery codes and I'm going to copy those codes and I can use them later. Uh one thing I want to notice if you know that this looks kind of ugly and it's
27:3227 minutes, 32 secondsthere's a particular reason for that. I do not want to force you to create the design that we forced you. You change
27:3927 minutes, 39 secondsthe design however you see fit according to your branding and client needs. So just know that in as a in advance. So
27:4927 minutes, 49 secondsnow that I have the recovery codes, let me actually log out to show you what happens after the user um log outs and creates the two factor authentication.
27:5827 minutes, 58 secondsSo let's go in and I'm going to log in again. This one and then I click login.
Chapter 11: Two-Factor Authentication and Audit Logs
28:0528 minutes, 5 secondsAnd now it's going to ask me for an authentication code. I click verify and boom, I'm back into the portal. So
28:1328 minutes, 13 secondsthat's how Mindful works and everything is authenticated and as you can see it's really really fast using the Cloudflare
28:2028 minutes, 20 secondsworkers with the Cloudflare D1 and you can create anything you can possibly imagine using the um Astro 6. All you
28:3028 minutes, 30 secondsneed to do is in the pages, as long as you put them inside here, inside the member ID directory, all the pages are
28:3728 minutes, 37 secondsgoing to be protected. And just make sure to use the mount protected layout and any other layouts as you like. Um,
28:4428 minutes, 44 secondsone last thing I want to show you about this is if we go to the D1 table again, you can see here. Let's go to the audit logs. I want to show you what happens.
28:5428 minutes, 54 secondsSo, let's refresh this. And as you can see all the things that this user did which was uh John Doe are added into the
29:0329 minutes, 3 secondsaudit log completely. As you can see here, you can see here the user registered successfully, email verify, user login and all the protected pages
29:1229 minutes, 12 secondsthat that user added along with their IP address and their location, latitude and longitude and and
29:2129 minutes, 21 secondseven the internet service provider, user agent and so on. And you can see all the information about that specific user. Uh
29:3129 minutes, 31 secondslike I mentioned before, the uh audit lock is basically for like portals that really require this type of of
29:3829 minutes, 38 secondsinformation in case they get audited and they need some uh evidence. So you can actually sell that to your clients for a hefty price. But anyway, let's continue.
29:4829 minutes, 48 secondsSo that's about it for the Mindful template. Uh when I made mine fallout, I made it to work exclusively with Astro
29:5629 minutes, 56 secondsbecause you can build anything any kind of authentication portal with Astro and Mindful A. And to give you an example of
30:0430 minutes, 4 secondsmy vision with Mindful Odd, I am working on an open-source learning management system for Astro 6 that I call the
30:1230 minutes, 12 secondsMindful LMS. Let me show you. So this is the Git portal. You have the mindful LMS
30:1930 minutes, 19 secondseducator and the mindful LMS student. So there are two different things with this one. Let me actually show you. Let's go
30:2730 minutes, 27 secondsto the to the local uh site and in here let's open mpm run
30:3630 minutes, 36 secondsdef and let's perfect so I can show you the preview. Oh, there we go. Perfect.
30:4230 minutes, 42 secondsSo it's exactly the same as the um of the Astro 6 template for Mindful Lot.
30:4830 minutes, 48 secondsExactly the same, but this one is different because it's an LMS that is running from Cloudflare D1. So let's go
30:5630 minutes, 56 secondsto Cloudflare D1. And over here you can see the tables. We got the courses, the instructors, the lessons, the progress,
31:0331 minutes, 3 secondsthe students, and the audit logs. So the instructors and the students are handled by Mindful. both have different
31:1131 minutes, 11 secondsauthentications. Both the instructors and the students can log in from using the mindful as authentication and from
Chapter 12: Mindful LMS Educator Portal Demo
31:1931 minutes, 19 secondsone cloud for D1 table. You don't need multiple. You handle both of them at the same time and mindful knows how to
31:2731 minutes, 27 secondsauthenticate each and keep them separate. So let me show you first the uh the educator portal which will be
31:3631 minutes, 36 secondsthis one. So, let me go to the other log and I need to go to the instructor's table and it's going to load and I'm going to
31:4531 minutes, 45 secondsuse me, which is like u I'm the instructor. Let's go over here and let's put that. And as you can see here is the
31:5331 minutes, 53 secondssame thing, but if we go to the educator CMS, you're going to see this one looks completely different. We got the dashboard, we got the manage students,
32:0132 minutes, 1 secondmanage courses, new course, manage lessons, new lessons, and all that. So the cool thing about this is let me show you. Let's go to the manage students.
32:1032 minutes, 10 secondsAnd as you can see here, I have Gandalf the Gray as one of my student and he and he has three enrolled courses. So let's
32:1832 minutes, 18 secondsgo to the D1 table again. And as you can see here in the students, this student is right here in my D1 and I got all the
32:2732 minutes, 27 secondsinformation. And the same thing from Mindful, the authentication status is unlocked. And in this case, they're using magic link as the authentication, but both of them are in the same table.
32:3932 minutes, 39 secondsLet's go back here. And if we go back to here, courses, you will be able to see the courses right here. Sample D1
32:4832 minutes, 48 secondscourse. And that I changed the title course, which I don't know why I did that, but hey, it's the course. Let's go back to the D1 table. And as you can see
32:5632 minutes, 56 secondshere in courses, you can see the title of the course, the description, the log, the thumbnail, and
33:0333 minutes, 3 secondsthe enrolled student for each of those courses. So let's go over here and you can actually edit that course. So if we
33:1133 minutes, 11 secondsgo here, I can edit the course. And in here I can see the title, the slug, I can change the description, the status,
33:1933 minutes, 19 secondspublish or draft, change the thumbnail, save the changes, and then the lessons for each one of those courses. And I can
33:2633 minutes, 26 secondsalso delete the courses and all the associated lessons. And the cool thing is that I added a editor here, which is
33:3533 minutes, 35 secondsthe tiny MC editor. So your instructor can use bold and and a word like
33:4333 minutes, 43 secondsdocument directly here and the changes will be added to the D1 table. Perfect.
33:4933 minutes, 49 secondsSo that's it. And if we go here to lessons over here, you can see that the lessons for each one of the courses are
33:5733 minutes, 57 secondshere. So let's say I want to change this one into mindful LMS. I click edit. I can change the title, the related course
34:0634 minutes, 6 secondsand all that. And I can edit this however I like and change it. And then we got the progress so your instructor
34:1434 minutes, 14 secondscan see who finishes the courses. And then the audit logs directly in this CMS portal. So perfect. So that's the
34:2334 minutes, 23 secondsmindful LMS educator. So this is the one that you sell to your clients so they can manage their courses directly in
34:3234 minutes, 32 secondscloud for D1 and the portal. You build it however you like. However, that's the educator part. Now, we're going to see
34:4034 minutes, 40 secondsthe student part. So, that's a different portal. So, let me close this and let's go to the Mindful LMS student. Let me
34:4734 minutes, 47 secondsactually close this. And this is the student one. Let's do the same. And mpm rundev.
34:5734 minutes, 57 secondsAnd there we go. We're going to open it again. And this one is the same thing, but the difference is that this one is
35:0535 minutes, 5 secondsnot for the educator. This one is for the students. So the one that logs in here is going to be Gandalf the gray and they're going to be logging in with
35:1335 minutes, 13 secondstheir record ID. So that's the same as before and they go here and boom. And
35:2035 minutes, 20 secondsthere we go. And they can see uh their all courses. You can see view all courses sample D1. They can click here
35:2835 minutes, 28 secondsand when they see the information about the course, they can start their course here and they will be able to see a video here and is they can mark their
Chapter 13: Mindful LMS Student Portal and Final Thoughts
35:3735 minutes, 37 secondslesson as completed, navigate to next lesson and so on and they can make this big. Yep. And then go to the next lesson
35:4535 minutes, 45 secondsand so on. And the the mindful LMS educator is where the instructor can change uh and add new courses without
35:5435 minutes, 54 secondseven touching the cloudare. So my goal uh with Mindful Ad is that we help each other out attract paying clients. So if
36:0336 minutes, 3 secondsyou're using Astro and the Mindful Ad to build secure authenticating portals, I I I want you to make money from them. Uh
36:1136 minutes, 11 secondslike for example, this LMS, you can sell that to one of your clients that's probably using another platform like Thinkic and you can save them a lot of
36:1936 minutes, 19 secondsmoney by building this for them. And it's really straightforward running from cloud 31 one table and it runs
36:2636 minutes, 26 secondseverything. And since I made it open source, we can help each other out to build different uh modules. For example,
36:3336 minutes, 33 secondsthis one doesn't have any payment methods because we can help each other out uh building that and help each other
36:4136 minutes, 41 secondsgain some customers. So uh we are living in tough times right now and if you decide to give Mindful out the opportunity for your Astro
36:4936 minutes, 49 secondsauthentication needs I I want to help you out uh by building templates like this like the Mindful LMS and and
36:5836 minutes, 58 secondshopefully we will help you get you to close your clients faster while remaining
37:0437 minutes, 4 secondsprofitable. And so that's it for this demo. If you you're more than welcome to contact me anytime by going to mindfulout.com/cont.
37:1537 minutes, 15 secondsAnd like I always like to finish my videos, I take a deep breath and let the
37:2237 minutes, 22 secondstroubles flow away with the sound.

Sync to video time