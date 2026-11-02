"""One-off builder: turns the Wikidata/Commons download cache (/tmp/wd) into catalogue rows.
Kept for provenance; future additions go through the admin page or scripts/import_artwork.py."""
import json, re, unicodedata
m = json.load(open('/tmp/wd/meta.json')); mats = json.load(open('/tmp/wd/mats.json'))
orig = json.load(open('/tmp/wd/orig.json'))
MAKER = {'Hieronymus Bosch':'hieronymus-bosch','Pieter Brueghel the Elder':'pieter-bruegel','Hans Memling':'hans-memling','Rogier van der Weyden':'rogier-van-der-weyden','Jan van Eyck':'jan-van-eyck','Hugo van der Goes':'hugo-van-der-goes','Dieric Bouts':'dieric-bouts','Gerard David':'gerard-david','Robert Campin':'robert-campin','Joachim Patinir':'joachim-patinir'}
DISPLAY = {'Pieter Brueghel the Elder':'Pieter Bruegel the Elder'}
PAL = {"gold-and-earth":["#c58e38","#8c461d","#472c1f","#e6cf9a"],"ultramarine":["#1e2846","#3c5aa6","#c9a24b","#e9e3d3"],"crimson-and-green":["#963d3a","#3f5a35","#2a1e18","#d9c9a8"],"stone-and-ivory":["#ebe7e6","#c4b29b","#968273","#5e5f5c"],"jewel-glow":["#2c3f8a","#8a1f2b","#d6a536","#1d1114"]}
rgb = lambda h: tuple(int(h[i:i+2],16) for i in (1,3,5))
def dist(a,b): return sum((x-y)**2 for x,y in zip(rgb(a),rgb(b)))**.5
def palette(cols):
    sc = {k: sum(min(dist(c,s) for s in sw) for c in cols) for k,sw in PAL.items()}
    return [min(sc, key=sc.get)]
RULES = [
 ('adoration', r'Adoration|Magi|Kings|Epiphany|Nativity|Shepherds'),
 ('virgin-and-child', r'Madonna|Virgin and Child|Virgin with|Child'),
 ('annunciation', r'Annunciat'),
 ('passion', r'Calvary|Cross|Crucifix|Passion|Ecce|Mocked|Thorns|Entombment|Lamentation|wounds'),
 ('saints', r'Saint|St\.|St |Hermit|Jerome|Christopher|Anthony|Baptist|Paul|Gregory|Sebastian|John'),
 ('angels', r'Angel|Last Judg|Rebel'),
 ('judgement-and-hell', r'Judg|Hell|Paradise|Hereafter|Rebel Angels|Death|Sins|Triumph|Garden of Earthly'),
 ('peasant-life', r'Peasant|Wedding|Dance|Harvest|Hay|Proverbs|Games|Census|Beggars|Herd|Cockaigne|Martin|Nest|Cards|Sower|Bird Trap|Carnival|Tavern'),
 ('landscape', r'Landscape|Hunters|Gloomy|Herd|Harvest|Hay|Winter|Flight|Babel|Sower|Wayfarer|Pilgrims|Gulf'),
 ('folly-and-moralising', r'Fools|Proverbs|Stone|Intemperance|Miser|Sins|Wayfarer|Blind|Misanthrope|Cockaigne|Dull|Magpie|Monkeys|Tavern|Carnival|Garden of Earthly'),
 ('history-and-war', r'Battle|Saul|Massacre|Soldiers|Babel|Naval'),
 ('animals', r'Monkeys|Magpie|Bird'),
 ('portraiture', r'Portrait|Head of|Halberdier|Sibylla|Lady|Donor'),
 ('christ-in-majesty', r'^Christ|Christ (Child|Driving)'),
]
def themes(t):
    out = [k for k,rx in RULES if re.search(rx, t, re.I)]
    return out[:4] or ['civic-life']
def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')[:70]
def first_sentences(t, n=2):
    parts = re.split(r'(?<=[.!?])\s+', t.strip()); return ' '.join(parts[:n])
MAT_LABEL = {'oil paint':'Oil paint','panel':'Wood panel','oak panel':'Oak panel','oakwood':'Oak panel','wood':'Wood panel','canvas':'Canvas','tempera':'Tempera','gold leaf':'Gold leaf','paper':'Paper','ink':'Ink','mixed technique':'Mixed technique','watercolor paint':'Watercolour'}
order = list(MAKER)
rows = []
items = sorted(m.values(), key=lambda v: (order.index(v['creator']), v['year'], v['title']))
slugs = {a['slug'] for a in orig}
for n, v in enumerate(items, start=16):
    aid = f'art-{n:03d}'; mk = DISPLAY.get(v['creator'], v['creator'])
    slug = slugify(f"{mk.split()[-1]} {v['title']}")
    while slug in slugs: slug += '-2'
    slugs.add(slug)
    y = v['year']; materials = list(dict.fromkeys(MAT_LABEL.get(mats.get(q,''), None) for q in v['mats'])) 
    materials = [x for x in materials if x]
    on_canvas = 'Canvas' in materials
    style = 'northern-renaissance' if y > 1505 or v['creator'] in ('Pieter Brueghel the Elder','Joachim Patinir') else 'early-netherlandish'
    dims = f"{v['height']:g} × {v['width']:g} cm" if v.get('height') and v.get('width') else None
    intro = first_sentences(v['extract']) if v.get('extract') else f"{v['title']} — a painting by {mk}, dated c. {y}, now in the {v['coll']}."
    mat_txt = (' on '.join([', '.join(x.lower() for x in materials if x not in ('Wood panel','Oak panel','Canvas')) or 'paint', next((x.lower() for x in materials if x in ('Wood panel','Oak panel','Canvas')), 'support')])) if materials else None
    va = (f"Recorded as {mat_txt}. " if mat_txt else "") + "The colour swatches are sampled from the digital reproduction and include frame and background; they are not a pigment analysis. A fuller visual description has not yet been written for this record."
    a = {
      'id': aid, 'slug': slug, 'title': v['title'], 'dateLabel': f'c. {y}', 'yearStart': y, 'yearEnd': y,
      'dateNote': 'Date from the Wikidata record; scholarly dating may differ.',
      'centuryIds': ['c15' if y <= 1500 else 'c16'], 'styleIds': [style], 'regionIds': ['low-countries'],
      'creationPlaceLabel': 'Low Countries', 'makerIds': [MAKER[v['creator']]], 'makerDisplay': mk,
      'mediumIds': ['canvas-painting' if on_canvas else 'panel-painting'], 'materials': materials, **({'dimensions': dims} if dims else {}),
      'paletteIds': palette(v['colours']), 'representativeColours': v['colours'],
      'paletteMethod': 'Median-cut quantisation of the downsampled digital image (6 colours, top 5 by area). Includes frames and background; not a pigment analysis.',
      'themeIds': themes(v['title']), 'institution': v['coll'], **({'accessionNumber': v['inv']} if v.get('inv') else {}),
      'introduction': intro, 'visualAnalysis': va,
      'image': {'display': f'/media/{aid}/display.webp', 'thumbnail': f'/media/{aid}/thumbnail.webp', 'width': v['w'], 'height': v['h'],
                'alt': f"{v['title']}, painting by {mk}", 'credit': f"{mk}, via Wikimedia Commons", 'rightsLabel': v['license'],
                'rightsUrl': 'https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia',
                'sourceFilePage': 'https://commons.wikimedia.org/wiki/File:' + v['file'].replace(' ','_'),
                'originalDownloadUrl': 'https://commons.wikimedia.org/wiki/Special:FilePath/' + v['file'].replace(' ','_')},
      'sources': [{'url': 'https://www.wikidata.org/wiki/' + v['qid'], 'title': 'Wikidata record', 'accessedAt': '2026-11-02'},
                  {'url': 'https://commons.wikimedia.org/wiki/File:' + v['file'].replace(' ','_'), 'title': 'Wikimedia Commons file record', 'accessedAt': '2026-11-02'}]
                 + ([{'url': 'https://en.wikipedia.org/wiki/' + v['wp'].replace(' ','_'), 'title': f"Wikipedia: {v['wp']}", 'accessedAt': '2026-11-02'}] if v.get('wp') else []),
      'verificationStatus': 'partial', '_src': f"/tmp/wd/out/{v['qid']}",
    }
    rows.append(a)
for i, a in enumerate(orig, start=1):
    a['image']['display'] = f"/media/{a['id']}/display.webp"; a['image']['thumbnail'] = f"/media/{a['id']}/thumbnail.webp"
    a['_src'] = f"/dev-server/public/artworks/{a['id']}"
all_rows = orig + rows
json.dump(all_rows, open('/tmp/wd/all.json','w'))
print(len(all_rows))
import collections; print(collections.Counter(t for a in rows for t in a['themeIds'])); print(collections.Counter(p for a in rows for p in a['paletteIds']))
