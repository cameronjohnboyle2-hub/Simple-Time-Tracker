# Team Time Clock

A bilingual English/Khmer time-clock workflow built for a small team: clock-in/out, weekly hours, correction requests, and administrator review. Cambodia time handling supports multiple daily intervals, overnight shifts, and manual corrections.

This version is a **fictional portfolio demo**. Choose a demo worker or open the admin view; no account or credentials are needed. All changes stay in this browser. Reset restores the three fictional workers and example correction request.

## Try the workflow

1. Open **Demo Amber** and inspect a seven-hour Monday shift.
2. Clock in and out, or submit a fictional correction request.
3. Open **Explore admin view → Requests** and approve the seeded correction from 16:00 to 17:00. Monday's total becomes eight hours.
4. Open a worker's day details to inspect or edit intervals. Switch English/Khmer and use **Reset demo** to start again.

Enter fictional information only. The demo is intentionally open to every visitor; its view selector is not a production authorization system.

## Run locally

Use Node.js 24 or later. There are no package dependencies and no installation step.

```sh
npm test
npm start
```

Open `http://127.0.0.1:4178`. The server binds loopback and serves only `public/`. Browser modules require a local server rather than opening HTML as a file.

## Design and implementation

- Vanilla JavaScript, CSS, browser modules, and native Node tests.
- English/Khmer interface and `Asia/Phnom_Penh` date calculations.
- Raw time events remain separate from approved overrides so a correction replaces only the edited day.
- Fictional data is seeded in the current Cambodia week, with a separate demo storage namespace. Legacy operational storage is not read.
- Worker names are rendered as text or escaped before entering HTML. The saved-state schema drops credential fields and malformed identifiers.
- No Firebase client, operational configuration, remote synchronization, or external runtime dependencies are shipped. A Content Security Policy denies script-initiated network connections.
- GitHub Pages runs tests before publishing only `public/`. Pull requests run tests and do not deploy.

## Contribution and evidence

Cameron Boyle built the original tool using AI-assisted development to support a team workflow. This demo preserves its bilingual interface and interval/correction logic while separating the portfolio experience from operational data and credentials. Adoption counts and efficiency claims are not established here.

The included regression suite covers interval handling, saved-state validation, literal rendering of names, deletion, server containment, and release isolation. Browser acceptance results and exact review provenance are recorded separately in the release report; passing logic tests does not establish production access control.

## Production and rights

This repository snapshot is not a production employee-record system. A live tracker requires trusted authentication, enforced per-worker/admin authorization, and a planned data migration. Removing a client integration does not change deployed database rules. See [SECURITY.md](SECURITY.md).

A source license has not yet been selected. Owner review of rights, attribution, and historical material precedes the final release. No study protocols, participant records, or production exports are included in this demo snapshot.
