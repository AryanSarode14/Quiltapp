# Quilt design document

## Project description

Students living away from family often need small favors but don't know whom
to ask: groceries, a package pickup, a borrowed essential item. Quilt is a
campus and neighborhood board where people post requests when they need help,
or offers when they have time to give. Like a quilt, many small pieces of help
make a supportive community. Quilt is for everyday favors, not emergencies; the
app reminds users to call 911 for those.

## User personas

### Mansi, international student living alone

- **Background:** First-year graduate student who moved from India a few months
  ago. Lives alone in a studio near campus, no car, still learning the city.
- **Goals:** Get small things done when she's sick, busy, or stuck without
  feeling like a burden. Build connections with people nearby.
- **Frustrations:** Group chats are noisy and requests get buried. She doesn't
  know which classmates live close by or have a car.

### Janvi, student with free time

- **Background:** Second-year undergraduate with a light semester and a part-time
  campus job. Remembers how hard her own first year was.
- **Goals:** Help people nearby in small, concrete ways that fit her schedule.
- **Frustrations:** Wants to help but rarely hears about specific needs until
  it's too late.

### Shivani, student with a car

- **Background:** Graduate student who drives to the grocery store and the
  airport regularly.
- **Goals:** Share trips she's already making so others don't have to pay for
  rides or carry heavy bags on transit.
- **Frustrations:** Coordinating over text is messy; she loses track of who
  asked to come along.

## User stories

**Heta Vimaleshkumar Patel — help requests (`helpRequests`)**

1. As Mansi, I want to post a help request with a category, urgency, area, and
   needed-by date, and edit or delete it, so that people nearby know what I
   need.
2. As Janvi, I want to browse and search open requests, filter by category and
   area, sort by urgency, and say I can help, so that I can support someone near
   me.
3. As Mansi, I want to update my request's status (open, in progress,
   completed), view my completed requests, and leave a rating and thank-you note
   for the helper, so that I can close the loop.

**Trupal Jageshkumar Patel — help offers (`helpOffers`)**

4. As Shivani, I want to post an offer of help with availability, area, and
   spots, and edit or delete it, so that others benefit from trips I'm already
   making.
5. As Mansi, I want to browse and search active offers, filter by category and
   area, claim a spot, and leave feedback afterward, so that I can get help
   without posting a request.
6. As Shivani, I want to see who claimed my offer, mark it full or completed,
   view my past offers, and read feedback I received, so that I can manage my
   commitments.

## Data model

**users:** `username`, `displayName`, `passwordHash`, `salt`, `createdAt`

**helpRequests:** `title`, `description`, `category`, `urgency`,
`urgencyRank`, `area`, `neededBy`, `contactNote`, `status`,
`requester {_id, displayName}`, `helper {_id, displayName} | null`,
`rating {stars, note, createdAt} | null`, `createdAt`, `updatedAt`

**helpOffers:** `title`, `description`, `category`, `area`, `date`,
`availability`, `spots`, `contactNote`, `status`,
`offerer {_id, displayName}`, `claims [{userId, displayName, claimedAt}]`,
`feedback [{userId, displayName, stars, comment, createdAt}]`, `createdAt`,
`updatedAt`

## Design mockups

REPLACE: Add your mockup images here (Figma, Excalidraw, or hand sketches).
Screens to cover:

1. Home page with "Ask for help" and "Offer help"
2. Browse requests (search, filters, cards)
3. Post or edit a request
4. My requests (Active, Completed, Helping tabs, rating form)
5. Browse offers
6. Post or edit an offer
7. My offers (claims, status, feedback)
8. My claimed spots (contact note, feedback form)
9. Log in and register
