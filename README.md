# ANDRES — Rooftop Smokehouse and Grill

Static demo site for a US rooftop barbecue restaurant. Plain HTML, CSS and
JavaScript — no framework, no build step, no dependencies.

## Run it

Open `index.html`. That's it.

## Pages

| File | |
|---|---|
| `index.html` | Home |
| `about.html` | Story, values |
| `menu.html` | Menu with filtering, search, PDF download |
| `reservations.html` | Booking flow |
| `contact.html` | Details, hours, enquiry form |

## What works

- **Reservations** — party size, month calendar, time slots generated from
  service hours and turn time, availability that responds to party size,
  validation, and a confirmation with a booking reference
- **Menu** — filter by course, free-text search, sold-out state, and a
  Download PDF that builds a print-styled menu (Save as PDF gives a real doc)
- Responsive nav with mobile drawer, condensing header, scroll reveals,
  keyboard operable throughout

## Booking rules

All in one place — `assets/js/site.js` → `CONFIG`:

| Setting | Current | Needs confirming |
|---|---|---|
| `turnMinutes` | 105 | How long a table is held |
| `slotStep` | 30 | Minutes between bookable times |
| `maxParty` | 10 | Largest party bookable online |
| `advanceDays` | 60 | How far ahead the book opens |
| `closedDays` | Monday | Which days are closed |
| `hours` | per weekday | Real opening hours |

## Still a demo

- Availability is simulated from a hash of date + time, so it behaves
  identically every time. No back end.
- Nothing is sent — no booking stored, no email delivered.
- Address, phone, email and all copy are placeholder.

## Deploying

Static site, no build. On Vercel: framework preset **Other**, no build
command, output directory **/** (repo root).
