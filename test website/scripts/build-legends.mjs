/* eslint-disable */
// Merges the original 43 legends (verbatim) with the workflow-authored new
// entries into one contiguous, monotonic ladder, and writes src/data/legends.ts.
//
//   node scripts/build-legends.mjs
//
// The new entries' `intensity` (1-100) is treated as an approximate target
// percentile and inverted through the original units<->percentile curve to find
// a sensible position on the scale; bands are then re-derived as contiguous
// [min,max) intervals via midpoints. André stays the apex.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const WORKFLOW_OUTPUT =
  'C:/Users/mattl/AppData/Local/Temp/claude/C--Users-mattl-Desktop-test-website/5175766e-21b1-4cf3-b638-3f23d83f448e/tasks/wzk3vzbpn.output'

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const round1 = (x) => Math.round(x * 10) / 10
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x))

// ── Original 43 (verbatim copy + tier metadata) ──────────────────────────────
const ORIGINALS = [
  { id: 'betty-ford', name: 'Betty Ford', era: 'First Lady & Founder, Betty Ford Center, 1918–2011', motif: 'ribbon', kind: 'real', units: 0, percentile: 0,
    verdict: "You have entered zero. Before you go, a word about Betty Ford. She admitted her addiction to alcohol and prescription pills publicly in 1978 — when no one did that, particularly not First Ladies. She then founded the Betty Ford Center and changed the landscape of addiction treatment in America. She is on this scale not as a drinker but as its conscience.",
    fact: "Betty Ford's public admission of addiction in 1978 is considered a watershed moment in American attitudes toward substance abuse. The Betty Ford Center, which she co-founded in 1982, has treated over 90,000 patients. Elizabeth Taylor was among her patients and became one of her closest friends. Ford later said her addiction was the best thing that ever happened to her." },
  { id: 'teetotaller', name: 'A Teetotaller', era: 'Of Sound Mind & Body', motif: 'glass-milk', kind: 'archetype', units: 0.1, percentile: 1,
    verdict: "You consumed so little that we fear you may have wandered in by mistake. The bar is that way, friend. No shame in abstinence — but you will not be finding your name on this scale.",
    fact: "Approximately 15% of American adults do not drink alcohol at all. The temperance movement of the 19th century attempted to make this universal. It produced Prohibition, organised crime, and a golden age of cocktail invention. The abstainers won the argument and lost the culture." },
  { id: 'pinocchio', name: 'Pinocchio', era: 'Fictional Wooden Boy, Pleasure Island', motif: 'puppet', kind: 'fictional', units: 1, percentile: 7,
    verdict: "One beer on Pleasure Island, and already your ears are growing. Pinocchio's acquaintance with alcohol was brief, transformative, and immediately punished by donkey-related metamorphosis. You are at the very threshold of consequence. Tread carefully.",
    fact: "In Carlo Collodi's original 1883 novel, the transformation into a donkey was a metaphor for the dangers of idleness and vice. One drink was enough to begin the process. Disney softened it considerably — in the book, the donkeys are then sold to salt mines and circuses." },
  { id: 'designated-driver', name: 'The Designated Driver', era: 'Sober Patron Saint', motif: 'car', kind: 'archetype', units: 2, percentile: 13,
    verdict: "A glass or two, nursed with quiet dignity. You are responsible, sensible, and frankly a little boring at parties. Your liver thanks you. Your friends, who got home safely, also thank you — though they will not say so tomorrow.",
    fact: "The designated driver concept was popularised in the US in the 1980s by a Harvard School of Public Health campaign. Before that, the idea of voluntarily not drinking at a party was considered eccentric. The campaign worked: drunk driving fatalities fell by roughly 50% between 1982 and 1997." },
  { id: 'leonard-nimoy', name: 'Leonard Nimoy', era: 'Mr. Spock & Recovered Alcoholic, 1931–2015', motif: 'rocket', kind: 'real', units: 3.5, percentile: 19,
    verdict: "Nimoy wrote openly about his alcoholism in his memoir I Am Spock, describing how he used drinking to manage the anxiety of fame and the strange burden of being permanently associated with a pointy-eared logician. He got sober in the 1980s and remained so. He is on this scale as a reminder that recovery is its own form of heroism.",
    fact: "Nimoy's alcoholism was, by his own account, a coping mechanism for the anxiety of celebrity and the identity crisis of being Spock. He described drinking alone in his car before public appearances. He got sober, lived another three decades, and died at 83 of COPD from decades of smoking — a separate vice he addressed in public health campaigns. You cannot win them all." },
  { id: 'buzz-aldrin', name: 'Buzz Aldrin', era: 'Apollo 11 Astronaut & Honest Memoirist, b. 1930', motif: 'moon', kind: 'real', units: 5.5, percentile: 26,
    verdict: "Aldrin walked on the moon and then came home to find that there was nothing left to do that could possibly compare. He developed depression and alcoholism — a consequence so psychologically logical it is almost inevitable. He got sober, wrote about it without shame, and remarried at 93. He is, in the most literal sense, someone who needed a drink after work.",
    fact: "Aldrin's post-Apollo depression is documented in his memoir Magnificent Desolation. He described the Moon landing as the peak from which everything else was descent. His alcoholism lasted through much of the 1970s. He has since become an advocate for mental health awareness, noting that the psychological aftermath of extreme achievement is rarely discussed alongside the achievement itself." },
  { id: 'edgar-allan-poe', name: 'Edgar Allan Poe', era: 'Poet & Cautionary Case, 1809–1849', motif: 'quill', kind: 'real', units: 7, percentile: 32,
    verdict: "Poe is one of history's most instructive cases: not a heroic drinker, but a catastrophic one. He was, by all accounts, a lightweight — a single glass could render him insensible. He did not drink often, but when he did, the consequences were operatic. You are drinking at Poe levels: not much, but enough to write something very strange afterwards.",
    fact: "Poe's cause of death in 1849 remains genuinely disputed by scholars. Leading theories include rabies, cooping (being drugged and forced to vote multiple times in local elections), and alcohol-related complications. He was found delirious in Baltimore wearing clothes that were not his own. He died four days later without explaining himself." },
  { id: 'van-gogh', name: 'Vincent van Gogh', era: 'Post-Impressionist Painter, 1853–1890', motif: 'palette', kind: 'real', units: 9, percentile: 37,
    verdict: "Van Gogh drank absinthe heavily, as did most of his Montmartre circle. A study in the Journal of the American Medical Association proposed that the thujone in absinthe may have contributed to his seizures, his yellow-tinted vision, and his famous fondness for yellow paint. He produced over 900 paintings in ten years. He sold one during his lifetime.",
    fact: "The thujone theory of Van Gogh's symptoms has been debated for decades. An alternative theory holds that his yellow vision was caused by digitalis, prescribed by his doctor for epilepsy — digitalis toxicity causes xanthopsia, yellow vision. Either way, his palette was almost certainly influenced by his medical treatment. The Sunflowers may be pharmacological in origin." },
  { id: 'et', name: 'E.T.', era: 'Extraterrestrial Visitor, California, 1982', motif: 'alien', kind: 'fictional', units: 11, percentile: 41,
    verdict: "E.T. consumed several of Elliott's beers, became visibly intoxicated, and transmitted the entire experience telepathically to a ten-year-old boy across town, causing the boy to release frogs during biology class and attempt to kiss a girl. You are drinking at alien levels: moderate, but with remarkable unintended consequences.",
    fact: "The scene depicts how alcohol affects impulse control and emotional regulation — shown here across two linked nervous systems simultaneously. The frogs being released is Elliott acting on E.T.'s uninhibited instinct. It is, medically speaking, an accurate depiction of lowered inhibitions at a BAC of roughly 0.05%." },
  { id: 'stephen-king', name: 'Stephen King', era: 'Author & Recovered Alcoholic, b. 1947', motif: 'book', kind: 'real', units: 13, percentile: 45,
    verdict: "King does not remember writing Cujo. He was drunk, or high, or both — he has said this plainly in On Writing, one of the most honest accounts of functional addiction in modern literature. He wrote bestsellers throughout his worst years. He got sober in the late 1980s. He considers the books he wrote drunk to be among his best and the period itself to be among his worst.",
    fact: "King's memoir On Writing contains a frank account of his family staging an intervention and emptying his office bin, which contained beer cans, cocaine in a bag, cigarette butts, and manuscript pages. He describes being incapable of distinguishing between productivity and self-destruction during this period. Misery was written largely during it. It is one of his finest novels." },
  { id: 'casual-enjoyer', name: 'The Casual Enjoyer', era: 'Standard-Issue Reveler', motif: 'beer', kind: 'archetype', units: 15, percentile: 48,
    verdict: "A respectable evening's work — enough to feel warm, charming, and perhaps briefly wise. This is the civilised mean, the Goldilocks zone of drinking. Neither legend nor amateur. You will remember tonight. Mostly.",
    fact: "The UK Chief Medical Officers' low-risk guideline is 14 units per week — roughly 6 pints of average-strength beer. You have just exceeded the weekly guideline in one evening. The guidelines were last updated in 2016 and immediately described by the Daily Mail as 'a killjoy intervention.'" },
  { id: 'otis-campbell', name: 'Otis Campbell', era: 'Town Drunk, Mayberry, The Andy Griffith Show, 1960–1968', motif: 'key', kind: 'fictional', units: 17.5, percentile: 50,
    verdict: "Otis Campbell is the only person on this scale who managed his own intake through voluntary self-incarceration. When he had drunk enough, he walked to the Mayberry jail, let himself in with his own key, and slept it off. He was unfailingly cheerful, never harmed anyone, and was treated by Sheriff Andy Taylor with consistent dignity. He is, in his way, a model of self-awareness.",
    fact: "Otis Campbell, played by Hal Smith, appeared in 36 episodes of The Andy Griffith Show. The character was written with unusual warmth for a comic drunk — he had a wife, a job, and a certain pride. He was eventually written out of the show in later seasons when the producers felt the portrayal of alcoholism had become too lighthearted. The jail key was a prop detail suggested by Hal Smith himself." },
  { id: 'wc-fields', name: 'W.C. Fields', era: 'Comedian, Gin Devotee & Philosopher, 1880–1946', motif: 'top-hat', kind: 'real', units: 20, percentile: 53,
    verdict: "Fields estimated his own consumption at two quarts of gin per day and kept bottles hidden on film sets, in his car, and throughout his home against the possibility of emergency. He famously said he never drank water because fish had sex in it. He died on Christmas Day, a holiday he claimed to despise. He was magnificent.",
    fact: "Fields' hatred of water was a running theme throughout his career — a genuine conviction that water was dangerous and gin was safe. He was not entirely wrong: in his era, municipal water supplies were genuinely unreliable, and alcohol did kill waterborne pathogens. He took a reasonable precaution to an unreasonable conclusion and maintained it for 66 years." },
  { id: 'rick-blaine', name: 'Rick Blaine', era: 'Café Américain, Casablanca, 1941', motif: 'whiskey-tumbler', kind: 'fictional', units: 23, percentile: 55,
    verdict: "Rick drinks alone, after hours, after the last customer has gone. He never drinks with the guests — that is his rule, and it is the saddest rule in cinema. He is not drunk; he is marinated in a particular variety of loss. You have reached the tier of elegant, purposeful, private drinking.",
    fact: "Humphrey Bogart, who played Rick, was himself a committed drinker who famously said the only people he'd met who didn't drink were people he didn't like. He died in 1957 of oesophageal cancer. His last words were reportedly: 'I should never have switched from Scotch to Martinis.'" },
  { id: 'chumbawamba', name: 'Chumbawamba', era: 'Tubthumping Era, Bradford, 1997', motif: 'guitar', kind: 'real', units: 26, percentile: 58,
    verdict: "A whisky drink, a vodka drink, a lager drink, a cider drink — in that order, on rotation, indefinitely. This is not heroism. This is a shopping list sung by a political anarchist collective from Bradford. You are cheerfully, indiscriminately committed to the full range. The song is about resilience. Tonight, so are you.",
    fact: "'Tubthumping' reached number 2 in the UK charts in 1997. Chumbawamba were a genuine anarchist collective who donated significant earnings to political causes. The song's defiant tone was intended as working-class solidarity. It became a drinking anthem anyway. The band were reportedly annoyed by this, which is extremely on-brand." },
  { id: 'jack-sparrow', name: 'Jack Sparrow', era: 'Captain, Black Pearl, The Caribbean', motif: 'pirate-flag', kind: 'fictional', units: 29, percentile: 61,
    verdict: "Someone has drunk the rum. It was you. Captain Jack Sparrow treats rum as a navigational instrument, a social lubricant, a currency, and occasionally a weapon. He is perpetually, magnificently, functionally intoxicated. He has escaped the British Navy, a kraken, and Davy Jones's Locker in this condition. You have merely had a good evening.",
    fact: "Johnny Depp based Sparrow's movement and manner partly on Keith Richards of the Rolling Stones, who is himself higher up this scale. The rum-soaked swagger was a deliberate physiological choice — Depp studied how sustained alcohol consumption affects the vestibular system and proprioception. Disney's studio executives initially considered firing him for it." },
  { id: 'nick-nora', name: 'Nick & Nora Charles', era: 'Manhattan & San Francisco, The Thin Man, 1934', motif: 'martini', kind: 'fictional', units: 32.5, percentile: 64,
    verdict: "Nick Charles is a retired detective who now drinks for sport. Nora, arriving at a party and finding Nick has had six martinis, immediately orders five more to catch up. They bicker, sparkle, and solve murders without setting down their glasses. You are drinking with elegance, velocity, and excellent repartee. Are you also solving a murder?",
    fact: "Dashiell Hammett based Nick and Nora on himself and his partner Lillian Hellman. In the novel, Nick consumes at least 53 martinis across the story. The Thin Man was praised by critics for making heavy drinking seem aspirational. The Production Code censors apparently did not count the drinks." },
  { id: 'kingsley-amis', name: 'Kingsley Amis', era: 'Novelist & Self-Appointed Authority, 1922–1995', motif: 'typewriter', kind: 'real', units: 36, percentile: 67,
    verdict: "Amis wrote Everyday Drinking — a memoir and manual — with the authority of a man who had done the research thoroughly and repeatedly over decades. He estimated his own lifetime consumption at approximately 80,000 pints-equivalent. He regarded hangovers as metaphysical events with spiritual dimensions requiring precise treatment.",
    fact: "Amis distinguished clinically between the Physical Hangover and the Metaphysical Hangover — the latter being a profound existential dread unrelated to physiology. His prescribed cure: a Bloody Mary, vigorous sex if available, and re-reading a reliable comic novelist. He recommended Wodehouse. He did not recommend water." },
  { id: 'hemingway', name: 'Ernest Hemingway', era: 'Author & Aficionado, 1899–1961', motif: 'cocktail', kind: 'real', units: 40, percentile: 70,
    verdict: "Hemingway's own accounts place his consumption at roughly a litre of whisky per day during his productive years, alongside wine at lunch and cocktails in the evening. He wrote in the mornings, before drinking. Each of his preferred drinks — the mojito, the daiquiri, the Papa Doble — was crafted to his precise specification. You are drinking like a man with opinions about drinking.",
    fact: "Hemingway's Papa Doble at El Floridita in Havana was a double rum daiquiri with no sugar and double grapefruit juice. He reportedly drank 16 of them in one session. The bar still serves it today. The no-sugar specification was possibly diabetic management, though Hemingway described it as simply tasting better." },
  { id: 'john-daly', name: 'John Daly', era: 'Professional Golfer, Lion & Long Driver, b. 1966', motif: 'golf', kind: 'real', units: 44.5, percentile: 73,
    verdict: "Daly has written and spoken about his alcoholism with a candour rare in professional sport. At his worst he estimated he was drinking a fifth of Jack Daniel's per day — around 34 units — alongside a gambling habit he put at $55 million in losses over his career. He is also one of the longest drivers in the history of golf, which raises interesting questions about the relationship between inhibition and club-head speed.",
    fact: "Daly's autobiography My Life In and Out of the Rough is one of sport's more startling self-portraits. He describes drinking a case of beer before rounds, passing out in a Hooters car park, and losing several fortunes at video poker. He won the 1991 PGA Championship and the 1995 Open Championship. He arrived at the 1991 PGA as the ninth alternate and won. He has suggested this was not despite his lifestyle but somehow alongside it." },
  { id: 'jeffrey-bernard', name: 'Jeffrey Bernard', era: 'Spectator Columnist, Coach & Horses, 1932–1997', motif: 'newspaper', kind: 'real', units: 49.5, percentile: 75,
    verdict: "Jeffrey Bernard wrote his Low Life column for the Spectator for decades — a weekly account of drinking in Soho's Coach and Horses pub on Greek Street, London. When he was too drunk to file, the magazine ran the note: 'Jeffrey Bernard is unwell.' This happened often enough that Keith Waterhouse turned the phrase into a successful West End play.",
    fact: "Bernard suffered from diabetes, pancreatitis, and ultimately had his leg amputated — all largely attributable to drinking. He continued anyway. The Coach and Horses landlord Norman Balon would occasionally lock Bernard out for his own protection. Bernard considered this a personal affront." },
  { id: 'brendan-behan', name: 'Brendan Behan', era: 'Irish Playwright & Declared Drinker, 1923–1964', motif: 'mask', kind: 'real', units: 55, percentile: 77,
    verdict: "Behan famously described himself as a drinker with a writing problem. In 1956 he arrived drunk to a BBC television interview and became the first person to use profanity on British television. The BBC received 200 complaints. Behan considered this a triumph. He died at 41, having produced two masterpieces and an unknowable quantity of Guinness.",
    fact: "Behan's play The Quare Fellow was written largely in pubs. He once said that the great thing about Dublin was that if you didn't like the people in one pub, you could be insulting them in another within five minutes. This is a reasonable description of both Dublin and of Behan." },
  { id: 'james-bond', name: 'James Bond', era: "Her Majesty's Secret Service, Licensed to Drink", motif: 'pistol', kind: 'fictional', units: 62, percentile: 80,
    verdict: "A 2013 study in the British Medical Journal calculated Bond's average intake across Fleming's 14 novels at 92 units per week — nearly four times the recommended limit — with a peak single-day consumption of 49.8 units. The BMJ noted he showed clear signs of alcohol dependence. He nonetheless outruns, outfights, and outseduces everyone.",
    fact: "The BMJ study concluded Bond's intake would likely have caused 'significant loss of libido and erectile dysfunction,' which the authors noted conflicted with the available narrative evidence. They also observed that many of his missions required fine motor skills — defusing bombs, for instance — that his blood alcohol level would have severely impaired." },
  { id: 'churchill', name: 'Winston Churchill', era: 'Prime Minister & Prodigious Consumer, 1874–1965', motif: 'cigar', kind: 'real', units: 69, percentile: 82,
    verdict: "Churchill's daily regime: a weak whisky and soda before breakfast, Champagne at lunch, Scotch through the afternoon, and brandy at dinner. His doctor Lord Moran estimated consumption at around 42 units daily. He won a World War and a Nobel Prize for Literature on this schedule.",
    fact: "Pol Roger Champagne sent Churchill a black-bordered mourning card when he died in 1965. Churchill once told a temperance campaigner: 'I have taken more out of alcohol than alcohol has taken out of me.' This is medically improbable but rhetorically unassailable." },
  { id: 'alexander-the-great', name: 'Alexander the Great', era: 'King of Macedonia, Conqueror of the Known World, 356–323 BC', motif: 'crossed-swords', kind: 'real', units: 76, percentile: 84,
    verdict: "Alexander drank unmixed wine at Macedonian symposia — considered barbaric even by Greek standards, who diluted wine three-to-one with water. He killed his closest friend Cleitus in a drunken rage in 328 BC. He died at 32 in Babylon, possibly of alcohol poisoning following a prolonged drinking bout, possibly typhoid, possibly both. He had conquered the known world by this point.",
    fact: "Ancient sources describe Alexander drinking from the Cup of Heracles — a bowl holding approximately six pints of unmixed wine — in one sitting, on multiple occasions. His death after a twelve-day illness following a banquet remains disputed. The drinking and the military conquest appear to have been concurrent rather than sequential, which raises interesting questions about causation." },
  { id: 'babe-ruth', name: 'Babe Ruth', era: 'Sultan of Swat & Prohibition Defier, 1895–1948', motif: 'baseball', kind: 'real', units: 83, percentile: 86,
    verdict: "Ruth drank throughout Prohibition with cheerful contempt for the law, consuming prodigious quantities the night before games and then hitting home runs anyway. His manager Miller Huggins once fined him $5,000 and suspended him for misconduct off the field. Ruth considered this unjust. He hit .315 that season.",
    fact: "Ruth's stomach was pumped at least twice during his career. He once ate 12 hot dogs between games of a doubleheader. He attributed his athletic power to 'clean living,' which his teammates found entertaining. His autopsy in 1948 attributed his death to nasopharyngeal cancer, possibly related to his tobacco use. The drinking, apparently, was not the issue." },
  { id: 'errol-flynn', name: 'Errol Flynn', era: 'Actor, Adventurer & Committed Hedonist, 1909–1959', motif: 'sword', kind: 'real', units: 90, percentile: 87,
    verdict: "Flynn claimed in his autobiography My Wicked, Wicked Ways to drink a bottle of vodka before lunch — a routine he described as simply how one prepared for the afternoon. He died at 50 looking considerably older. His doctor said his body resembled that of a man of seventy. Flynn considered this an achievement of sorts.",
    fact: "Flynn's autobiography is one of Hollywood's most candid self-portraits — he described his drinking and general misbehaviour with cheerful frankness unusual for the era. He died in Vancouver while attempting to sell his yacht, which he needed because he had spent his considerable fortune. His doctor's observation about his apparent age of 70 was made when Flynn was 50. He had lived at roughly 1.4x speed." },
  { id: 'george-best', name: 'George Best', era: "Manchester United & Belfast's Finest, 1946–2005", motif: 'football', kind: 'real', units: 98, percentile: 88,
    verdict: "Best said he spent a lot of money on booze, birds, and fast cars — the rest he just squandered. He was arguably the most naturally gifted footballer who ever lived and retired effectively at 26. He received a liver transplant in 2002 and was photographed drinking champagne within weeks. His final note, written in hospital, read: 'Don't die like me.'",
    fact: "Best's liver transplant was controversial — the surgeon later said he would not do so again given Best's subsequent behaviour. Best's blood alcohol level at various arrests was recorded at levels doctors considered incompatible with normal function. He apparently functioned anyway, though not at his 1968 European Cup standard." },
  { id: 'william-holden', name: 'William Holden', era: 'Actor, Sunset Boulevard & The Bridge on the River Kwai, 1918–1981', motif: 'film-reel', kind: 'real', units: 106, percentile: 89,
    verdict: "Holden was consuming a bottle of vodka per day through much of his later career — a habit directors worked around. He died alone in his Santa Monica apartment, having fallen and struck his head on a bedside table while drunk. He lay undiscovered for four days. He had won an Academy Award. He deserved better.",
    fact: "Holden's death in 1981 was made more poignant by the four-day delay before discovery — a detail that prompted reflection on the isolation of celebrity. His blood alcohol level at death was 0.22%, well above the legal driving limit. He had been sober for periods of his life and reportedly described vodka as 'breakfast, lunch, and dinner' during his worst years." },
  { id: 'sinatra', name: 'Frank Sinatra', era: 'Chairman of the Board, 1915–1998', motif: 'microphone', kind: 'real', units: 115, percentile: 90,
    verdict: "Jack Daniel's Old No. 7, on the rocks, in a crystal glass, with a specific ice-to-spirit ratio Sinatra's people communicated to venues in advance. He drank approximately a bottle per day, demanded it waiting in every city, and was buried with a bottle, a pack of Camel cigarettes, a Zippo lighter, and a roll of dimes for the payphone. The Chairman prepared for all eventualities.",
    fact: "Jack Daniel's experienced a significant sales increase attributable to Sinatra's association — an endorsement that was unsolicited and unpaid. The distillery later named a premium expression 'Sinatra Select.' He was introduced to Old No. 7 by comedian Jackie Gleason, himself a formidable drinker who does not appear on this scale only due to insufficient documentation." },
  { id: 'elizabeth-taylor', name: 'Elizabeth Taylor', era: "Actress, Icon & Betty Ford's Most Famous Patient, 1932–2011", motif: 'diamond', kind: 'real', units: 125, percentile: 91,
    verdict: "Taylor was treated at the Betty Ford Center in 1983, where she met Betty Ford herself, and the two became lifelong friends. She described her addiction to alcohol and prescription pills with the same directness she brought to everything. She married eight times — twice to Richard Burton, which suggests either great optimism or a taste for catastrophe. Possibly both.",
    fact: "Taylor and Burton's relationship was described by both as the great passion of their lives and also genuinely dangerous. Her friendship with Betty Ford — two women who had been very publicly broken and rebuilt — is one of Hollywood's more moving late-chapter stories. Taylor said Ford taught her that asking for help was not weakness. She spent the rest of her life demonstrating this." },
  { id: 'peter-otoole', name: "Peter O'Toole", era: 'Lawrence of Arabia & Legendary Carouser, 1932–2013', motif: 'lion', kind: 'real', units: 135, percentile: 92,
    verdict: "O'Toole claimed to have consumed a bottle of brandy per day for a sustained period, and described his drinking years as 'a most glorious time.' He stopped entirely in 1975 after a near-fatal illness, then lived another 38 years in sobriety. He was nominated for eight Academy Awards without winning one. Both facts seemed equally to amuse him.",
    fact: "O'Toole and Richard Burton were close friends and occasional drinking companions. O'Toole survived to 81. Burton died at 58. O'Toole attended the funeral and reportedly toasted his friend with a glass of water, which he described as the saddest drink he had ever consumed." },
  { id: 'ulysses-grant', name: 'Ulysses S. Grant', era: 'Union General & 18th President of the United States, 1822–1885', motif: 'medal', kind: 'real', units: 147, percentile: 93,
    verdict: "When informed that General Grant drank too much, President Lincoln reportedly said: 'Find out what brand of whisky he drinks and send a barrel of it to each of my other generals.' Grant won the Civil War while drinking with a consistency his staff documented at length. He then served two terms as President. The whisky was reportedly Old Crow bourbon.",
    fact: "Lincoln's remark about Grant's whisky — if he said it, which historians debate — reflects a genuine pragmatic attitude: Grant was winning battles that other generals were losing sober. Grant's memoirs, written while dying of throat cancer and racing to finish before death to provide for his family, are considered among the finest military memoirs in English. He finished four days before he died. Mark Twain published them." },
  { id: 'richard-burton', name: 'Richard Burton', era: 'Actor & Shakespearean, Wales, 1925–1984', motif: 'mask-tragedy', kind: 'real', units: 160, percentile: 94,
    verdict: "Burton's biographers estimate his consumption at up to three bottles of vodka daily during his worst periods — approximately 90 units, a quantity the medical literature considers incompatible with sustained life. He sustained it for decades while performing Shakespeare and winning international awards. He died at 58 of a cerebral haemorrhage.",
    fact: "Burton's doctor informed him in the early 1960s that his liver was 'the size of a rugby ball' and gave him five years. Burton lived another twenty-plus years. His Shakespearean voice — considered one of the finest in the 20th century — was preserved on recordings made while he was, by his own account, quite drunk." },
  { id: 'ric-flair', name: 'Ric Flair', era: 'Nature Boy, Professional Wrestling, b. 1949', motif: 'crown', kind: 'real', units: 175, percentile: 95,
    verdict: "WOOOOO. Flair documented his consumption in his autobiography To Be the Man: ten beers and four double vodkas before noon while on tour, as a matter of routine. He describes this not as excess but as maintenance. He wrestled in this condition, cut promos in this condition, and wore sequined robes in this condition. Whether the robes required the drinks or the drinks required the robes remains unclear.",
    fact: "Flair's blood alcohol level during a 2017 medical emergency was recorded at 0.32%, four times the legal driving limit. He survived. He has since spoken about getting sober. His autobiography is one of professional wrestling's more candid documents — frank about both the physical demands of the sport and the consumption he believed was required to sustain them. The robes remain." },
  { id: 'keith-moon', name: 'Keith Moon', era: 'The Who, Hotel Destroyer, 1946–1978', motif: 'drum', kind: 'real', units: 190, percentile: 96,
    verdict: "Moon did not merely drink — he detonated. Cherry bombs in hotel toilets. A Rolls-Royce into a Holiday Inn swimming pool. A Lincoln Continental into a different swimming pool. Drumming of impossible precision executed in apparent chaos. He died at 32 of an overdose of Heminevrin, prescribed to treat his alcohol withdrawal. He had taken 32 tablets. The prescribed dose was one.",
    fact: "Keith Moon's drumming technique — all four limbs operating independently at high speed with no conventional jazz influence — is considered by many drummers to be physiologically extraordinary. He never practiced formally. His method, as he described it, was 'to play as if it's the last song I'll ever play.' It eventually was." },
  { id: 'boris-yeltsin', name: 'Boris Yeltsin', era: 'President of the Russian Federation, 1991–1999', motif: 'flask', kind: 'real', units: 208, percentile: 97,
    verdict: "Yeltsin conducted international diplomacy in a condition his aides described diplomatically as 'fatigued.' He failed to disembark his plane in Ireland to meet the Taoiseach, who waited on the tarmac. He was found by Secret Service agents wandering Pennsylvania Avenue in his underwear attempting to hail a taxi to get pizza. He ran a nuclear state.",
    fact: "The Clinton administration developed protocols for managing meetings with Yeltsin around his consumption, including ensuring important discussions happened in the morning. The CIA's reports on his health during this period remain partially classified. He resigned on New Year's Eve 1999, handing power to Vladimir Putin — an event historians continue to assess." },
  { id: 'hunter-thompson', name: 'Hunter S. Thompson', era: 'Gonzo Journalist & Pharmacological Pioneer, 1937–2005', motif: 'bat', kind: 'real', units: 225, percentile: 97.5,
    verdict: "Thompson's self-documented daily schedule included Chivas Regal at waking, bourbon through the afternoon, and Champagne as a palate cleanser. Alcohol was the foundation beneath a towering superstructure of other substances. He covered a presidential campaign this way. He wrote Fear and Loathing in Las Vegas this way. Tonight, you are going full Gonzo.",
    fact: "Thompson's published drug and alcohol logs have been analysed by pharmacologists who describe his documented daily intake as 'incompatible with normal cognitive function.' Thompson continued to write lucidly under these conditions. He shot himself in 2005, leaving a note reading: 'I am 67. That is 17 years past 50.' He had asked to have his ashes fired from a cannon. They were." },
  { id: 'oliver-reed', name: 'Oliver Reed', era: 'Actor & Undefeated at 61, 1938–1999', motif: 'tankard', kind: 'real', units: 250, percentile: 98,
    verdict: "Reed claimed to have drunk 104 pints of beer during a single pub crawl in 1963. His companions disputed only the precision, not the scale. He died in Malta in 1999 during a drinking session on the Gladiator set, having beaten five Royal Marines at arm wrestling. His final bar tab reportedly included three bottles of rum, eight beers, and numerous doubles. He was winning.",
    fact: "Reed's role as Proximo in Gladiator was completed posthumously using CGI — the first major use of the technology to complete a dead actor's performance. The arm-wrestling with Royal Marines was apparently unscripted. The Marines lost." },
  { id: 'marion-ravenwood', name: 'Marion Ravenwood', era: 'Nepal, 1936 — Raiders of the Lost Ark', motif: 'shot-glass', kind: 'fictional', units: 280, percentile: 98.5,
    verdict: "Marion Ravenwood runs a bar in the Himalayas and wins shots contests against large men for money. This is her profession. She then survives kidnapping, the Ark of the Covenant, and Indiana Jones — in that order of difficulty. If you have reached Marion's tier, you are not merely drinking. You are operating.",
    fact: "The opening scene of Raiders of the Lost Ark was intended by Spielberg to establish Marion as the toughest person in the film, including Jones himself. Her drinking capacity is presented not as a character flaw but as a professional skill — she runs a bar at altitude in Nepal, which requires both supply chain management and personal quality control." },
  { id: 'spike-gremlin', name: 'Spike the Gremlin', era: 'Clamp Enterprises Tower, New York, 1990', motif: 'lightning', kind: 'fictional', units: 315, percentile: 99,
    verdict: "Spike ordered a cocktail at a Manhattan bar, proceeded to a strip club, and then caused catastrophic structural damage to a skyscraper. He accomplished this while being approximately the size of a housecat. The alcohol-to-structural-damage ratio is without precedent in documented history. You have entered the realm of the chemically transformed.",
    fact: "The Gremlins franchise established that the creatures are sensitive to water, sunlight, and food after midnight. Alcohol appears to enhance their capabilities rather than impair them. This is consistent with a small number of documented human cases, though the resulting structural damage tends to be more targeted toward crockery." },
  { id: 'wade-boggs', name: 'Wade Boggs', era: 'Red Sox Third Baseman & Aviation Legend', motif: 'plane', kind: 'real', units: 365, percentile: 99.5,
    verdict: "Boggs claimed, on the Howard Stern Show, to have drunk 64 beers on a cross-country flight from Boston to Los Angeles — approximately 147 units in five hours, or one beer every four to five minutes for the entire journey. He batted .366 that season. Teammates corroborated the broad outline. No physiological explanation has been offered.",
    fact: "Boggs also ate chicken before every single game — a superstition so rigorous he developed over 40 chicken recipes catalogued in his autobiography. The intersection of elite athletic performance, industrial beer consumption, and obsessive poultry management makes him one of the more statistically unusual figures in American sports history. The chicken recipes have been reviewed and are apparently good." },
  { id: 'andre', name: 'André the Giant', era: 'Eighth Wonder of the World, 1946–1993', motif: 'mountain', kind: 'real', units: 450, percentile: 99.9,
    verdict: "You have reached the summit. André stood 7'4\" and weighed 520 pounds. His acromegaly altered his metabolism fundamentally. He reportedly consumed between 100 and 156 beers in a single sitting on multiple documented occasions — roughly 230–360 units. His companions, travel agents, and fellow wrestlers all gave consistent testimony. What is your excuse? There is none. You are a wonder of the world.",
    fact: "Before André's hip surgery, anaesthesiologists calculated his dosage directly from his self-reported daily alcohol intake, as standard formulae were not designed for his metabolism. They used approximately three times the normal dose. André told them his daily intake honestly. The lead anaesthesiologist reportedly went quiet for a moment, then said 'alright then.' The surgery was successful." },
]

// ── Load workflow output ─────────────────────────────────────────────────────
const wf = JSON.parse(readFileSync(WORKFLOW_OUTPUT, 'utf8'))
const NEW = wf.result.map((n) => ({
  id: n.id,
  name: decode(n.name),
  era: decode(n.era),
  motif: n.motif,
  kind: n.kind,
  verdict: decode(n.verdict),
  fact: decode(n.fact),
  intensity: n.intensity,
}))

// ── Calibrate intensity -> units via the original units<->percentile curve ───
const byU = ORIGINALS.map((o) => ({ u: o.units, p: o.percentile })).sort((a, b) => a.u - b.u)
const byP = [...byU].sort((a, b) => a.p - b.p)

function lerp(x, arr, fromKey, toKey) {
  const n = arr.length
  if (x <= arr[0][fromKey]) return arr[0][toKey]
  if (x >= arr[n - 1][fromKey]) return arr[n - 1][toKey]
  for (let i = 0; i < n - 1; i++) {
    const a = arr[i]
    const b = arr[i + 1]
    if (x >= a[fromKey] && x <= b[fromKey]) {
      const span = b[fromKey] - a[fromKey] || 1
      const t = (x - a[fromKey]) / span
      return a[toKey] + t * (b[toKey] - a[toKey])
    }
  }
  return arr[n - 1][toKey]
}
const unitsFromPct = (p) => lerp(p, byP, 'p', 'u')
const pctFromUnits = (u) => lerp(u, byU, 'u', 'p')

// ── Combine + position ───────────────────────────────────────────────────────
const combined = [
  ...ORIGINALS.map((o) => ({ ...o, pos: o.units, source: 'orig' })),
  ...NEW.map((n) => ({ ...n, pos: unitsFromPct(clamp(n.intensity, 1, 99.4)), source: 'new' })),
]

// Sort ascending by position; tie-break by intensity then name. André pinned last.
combined.sort((a, b) => {
  if (a.id === 'andre') return 1
  if (b.id === 'andre') return -1
  if (a.pos !== b.pos) return a.pos - b.pos
  const ai = a.intensity ?? a.percentile ?? 0
  const bi = b.intensity ?? b.percentile ?? 0
  if (ai !== bi) return ai - bi
  return a.name.localeCompare(b.name)
})

// Force strictly-increasing positions (so band midpoints are non-degenerate).
for (let i = 1; i < combined.length; i++) {
  if (combined[i].pos <= combined[i - 1].pos) combined[i].pos = combined[i - 1].pos + 0.5
}

// Derive contiguous [min,max) bands via midpoints.
const N = combined.length
for (let i = 0; i < N; i++) {
  const l = combined[i]
  l.minUnits = i === 0 ? 0 : round1((combined[i - 1].pos + l.pos) / 2)
  l.percentile = i === N - 1 ? 99.9 : round1(pctFromUnits(l.pos))
}
// Repair any rounding collisions -> strictly increasing minUnits, non-decreasing percentile.
for (let i = 1; i < N; i++) {
  if (combined[i].minUnits <= combined[i - 1].minUnits) {
    combined[i].minUnits = round1(combined[i - 1].minUnits + 0.1)
  }
  if (combined[i].percentile < combined[i - 1].percentile) {
    combined[i].percentile = combined[i - 1].percentile
  }
}
for (let i = 0; i < N; i++) {
  combined[i].maxUnits = i === N - 1 ? Infinity : combined[i + 1].minUnits
}

// ── Validate ─────────────────────────────────────────────────────────────────
const ids = new Set()
for (let i = 0; i < N; i++) {
  const l = combined[i]
  if (ids.has(l.id)) throw new Error(`Duplicate id: ${l.id}`)
  ids.add(l.id)
  if (l.minUnits >= l.maxUnits) throw new Error(`Empty band: ${l.id} [${l.minUnits},${l.maxUnits})`)
  if (i > 0 && l.minUnits !== combined[i - 1].maxUnits) throw new Error(`Gap before ${l.id}`)
  if (i > 0 && l.minUnits <= combined[i - 1].minUnits) throw new Error(`Non-increasing min at ${l.id}`)
}
if (combined[0].minUnits !== 0) throw new Error('First band must start at 0')
if (combined[N - 1].id !== 'andre' || combined[N - 1].maxUnits !== Infinity)
  throw new Error('André must be the apex with maxUnits Infinity')

// ── Emit src/data/legends.ts ─────────────────────────────────────────────────
const body = combined
  .map(
    (l) => `  {
    id: ${JSON.stringify(l.id)},
    name: ${JSON.stringify(l.name)},
    era: ${JSON.stringify(l.era)},
    motif: ${JSON.stringify(l.motif)},
    kind: ${JSON.stringify(l.kind)},
    minUnits: ${l.minUnits},
    maxUnits: ${l.maxUnits === Infinity ? 'Infinity' : l.maxUnits},
    percentile: ${l.percentile},
    verdict: ${JSON.stringify(l.verdict)},
    fact: ${JSON.stringify(l.fact)},
  },`,
  )
  .join('\n')

const out = `// AUTO-GENERATED by scripts/build-legends.mjs — do not edit by hand.
// ${N} legends, contiguous [minUnits, maxUnits) bands, André the apex.
import type { Legend } from '../lib/types'

export const LEGENDS: Legend[] = [
${body}
]
`

mkdirSync(resolve(ROOT, 'src/data'), { recursive: true })
writeFileSync(resolve(ROOT, 'src/data/legends.ts'), out, 'utf8')

console.log(`Wrote src/data/legends.ts with ${N} legends.`)
console.log('Rank  Units-range            Pct    Name')
combined.forEach((l, i) => {
  const range = `${l.minUnits}–${l.maxUnits === Infinity ? '∞' : l.maxUnits}`.padEnd(20)
  console.log(`${String(N - i).padStart(3)}  ${range}  ${String(l.percentile).padStart(5)}  ${l.name}`)
})
