# Services

Packages come from Neon's `portfolio_services` table. Edit `name`, `tagline`, `category`, `starting_price`, `timeline`, `features`, and optional example fields directly, then set `published` true. Prices are PHP values; features use a native PostgreSQL text array. No JSON document or local catalog is needed. The deprecated `content` compatibility projection is generated automatically for older frontend builds.

The homepage shows three category summaries (Websites, Games, Mobile Apps), with starting prices calculated from published packages. The full Services page groups packages into Websites, Games, and Mobile, each with three options. Game starting prices are PHP 8,000 / 20,000 / 50,000; mobile app starting prices are PHP 12,000 / 35,000 / 70,000. Scopes, timelines, and inquiry selections are per package. The two older broad packages remain unpublished.

Contact and service inquiries use mailto:ajmission28@gmail.com. Form details are URL-encoded into the email subject and body. Visitors send the prepared message from their email app; opening it does not confirm delivery. No SMTP credentials or server email endpoint are required.

See DATABASE.md for column definitions, migrations, storage, and rollout compatibility.
