# Services

The homepage and `/services` render at request time. Packages and starting prices are read from Neon's `portfolio_services` table through `lib/services.ts`. Edit its `content` JSON and set `published` to true to display a package. New package IDs work without code changes; database edits appear on refresh. There is no local catalog fallback.

Contact and service inquiries use `mailto:ajmission28@gmail.com`. Validated details are URL-encoded into the email subject and body. Visitors must send the message from their configured email app; opening it does not confirm delivery. Forms retain their contents and provide a direct email link as a fallback. No SMTP credentials or server email endpoint are required.

See `DATABASE.md` for project database and file-storage setup.
