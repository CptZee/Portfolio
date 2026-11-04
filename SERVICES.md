# Services

The homepage and `/services` render at request time. Packages and starting prices are read from Neon's `portfolio_services` table through `lib/services.ts`. Edit its `content` JSON and set `published` to true to display a package. New package IDs work without code changes; database edits appear on refresh. There is no local catalog fallback.

The homepage shows three compact category cards (Websites, Games, Mobile Apps), with starting prices calculated from the published database packages. Each card links to its section on `/services`, which contains the full tier comparisons and inquiry form.

The catalog groups packages into Websites, Games, and Mobile. Games have three tiers: prototype (from PHP 8,000), playable demo (from PHP 20,000), and a small complete 2D game (from PHP 50,000). Mobile has three tiers: prototype (from PHP 12,000), MVP (from PHP 35,000), and a small complete app (from PHP 70,000). Each tier has its own scope, timeline, and inquiry selection. The old broad game/mobile packages are unpublished. Starting prices are scope-dependent; artwork, multiplayer, extra backend integrations, and platform fees are scoped separately.

Contact and service inquiries use `mailto:ajmission28@gmail.com`. Validated details are URL-encoded into the email subject and body. Visitors must send the message from their configured email app; opening it does not confirm delivery. Forms retain their contents and provide a direct email link as a fallback. No SMTP credentials or server email endpoint are required.

See `DATABASE.md` for project database and file-storage setup.
