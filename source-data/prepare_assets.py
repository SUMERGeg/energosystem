"""Fetch original public portfolio assets; retain source wording and historical status."""
from pathlib import Path
import re, json, html, shutil, urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parents[3]
BASE = 'https://energosystemrus.ru/'
HERE = Path(__file__).resolve().parent
ASSETS = HERE.parent / 'dist' / 'assets'
REF = ROOT / 'output/energosystem-concept-20261030/references'
ASSETS.mkdir(parents=True, exist_ok=True)
def plain(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', ' ', s))).strip()

names = ['bauman-dome', 'archangel-church', 'khudozhestvenny', 'data-center', 'botanica', 'restaurant-lika', 'hotel-sheremetyevskaya', 'moscow-prosecutor', 'bogorodsky', 'golitsyno-factory', 'khoroshevskoe', 'zeleny-gorod', 'odintsovo-1', 'krasnoznamensk', 'fabriziusa-house']
cards = (REF/'projects.html').read_text(encoding='utf-8').split('<div class="projects__item">')[1:]
projects = []
downloads = []
for i, block in enumerate(cards):
    top = re.search(r'projects__item-text-top">(.*?)</div>', block, re.S).group(1)
    spans = re.findall(r'<span>(.*?)</span>', top, re.S)
    bottom = re.search(r'projects__item-text-bottom">(.*?)</div>', block, re.S).group(1)
    client = plain(re.search(r'projects__item-text-right">(.*?)</div>', block, re.S).group(1))
    img = re.search(r'<img\s+src="([^"]+)"', block).group(1)
    p = {'id': names[i], 'title_and_scope_source': plain(bottom), 'year': plain(spans[0]), 'status_source': plain(spans[1]), 'client': client.removeprefix('заказчик:').strip(), 'image_source_url': urllib.parse.urljoin(BASE, img), 'source_url': BASE+'realizovannye-proekty'}
    p['title'] = plain(bottom.split('<span>')[0])
    p['work_scope'] = plain(bottom.split('<span>', 1)[1]) if '<span>' in bottom else ''
    p['first_photo_caption'] = plain(re.search(r'data-caption="([^"]+)"', block).group(1))
    if i == 5:
        p['source_conflict_note'] = 'Название карточки: ресторан Лика; подпись фото: кафе-ресторан НИКИ. Не объединять как проверенное название.'
    if i < 9 or 'процессе' in p['status_source']:
        filename = names[i] + Path(img).suffix
        p['image_filename'] = filename
        downloads.append((p['image_source_url'], filename))
    projects.append(p)

for n in range(1, 9):
    downloads.append((BASE + f'assets/images/dist/our_zakazchiki_{n}.webp', f'client-{n}.webp'))
downloads.append((BASE+'assets/images/dist/logo.webp', 'logo.webp'))
downloads.append((BASE+'assets/images/dist/ЦОД/photo_2024-11-29_17-50-51.jpg', 'data-center-electrical-panels.jpg'))
def fetch(pair):
    url, filename = pair
    safe_url = urllib.parse.quote(url, safe=':/?=&%')
    request = urllib.request.Request(safe_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(request, timeout=40) as response:
        data = response.read()
    (ASSETS/filename).write_bytes(data)
    return f'{filename}: {len(data)} bytes'
with ThreadPoolExecutor(max_workers=5) as pool:
    for result in pool.map(fetch, downloads):
        print(result)
fonts = ROOT/'node_modules/@fontsource-variable/manrope/files'
for subset in ['latin', 'cyrillic']:
    src = fonts/f'manrope-{subset}-wght-normal.woff2'
    if src.exists():
        shutil.copyfile(src, ASSETS/f'manrope-{subset}.woff2')
(HERE/'projects.json').write_text(json.dumps({'source_url': BASE+'realizovannye-proekty', 'retrieved_date': '2026-10-30', 'status_note': 'Статусы и годы воспроизведены из источника. Актуальность статуса работ на 2026 год не подтверждена.', 'homepage_in_progress_link': BASE+'realizovannye-proekty', 'projects': projects}, ensure_ascii=False, indent=2), encoding='utf-8')
clients = ['ПИК Группа', 'УкрРосМеталл', 'Сбербанк', 'ИнжКапСтрой', 'Лидер Инвест', 'КОРТРОС', 'МонАрх', 'Домстрой']
(HERE/'clients.json').write_text(json.dumps([{'name': name, 'image_filename': f'client-{i}.webp', 'image_source_url': BASE+f'assets/images/dist/our_zakazchiki_{i}.webp', 'source_url': BASE, 'identification': 'Надпись на оригинальном логотипе проверена визуально'} for i, name in enumerate(clients, 1)], ensure_ascii=False, indent=2), encoding='utf-8')
(HERE/'supporting-images.json').write_text(json.dumps([{'image_filename': 'data-center-electrical-panels.jpg', 'caption_source': 'ЦОД; г. Москва — Электрощитовая', 'image_source_url': BASE+'assets/images/dist/ЦОД/photo_2024-11-29_17-50-51.jpg', 'source_url': BASE+'realizovannye-proekty'}], ensure_ascii=False, indent=2), encoding='utf-8')
