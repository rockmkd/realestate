import requests
import json
import math
import warnings
from requests.packages.urllib3.exceptions import InsecureRequestWarning

warnings.simplefilter('ignore', InsecureRequestWarning)


def get_data(apt_id):
    more_data = True
    page = 1
    result = []
    while more_data:
        url = f"https://new.land.naver.com/api/articles/complex/{apt_id}?tradeType=A1&page={page}"
        response = requests.get(url, verify=False)
        data = json.loads(response.text)
        result = result + data['articleList']

        if data['isMoreData']:
            page = page + 1
        else:
            more_data = False
    return result


# {
#     key: 'builing + floor + price',
#     price: 
#     floor:
#     building:
#     size:
#     desc: 
# }


def dedupe(data):
    deduped_data = []
    for article in data:
        key = article['buildingName'] + article['floorInfo'] + article['dealOrWarrantPrc']
        el = [x for x in deduped_data if x['key'] == key]
        if len(el) == 0:
            deduped_data.append({
                'key': key,
                'price': str_to_num(article['dealOrWarrantPrc']),
                'just_price': article['dealOrWarrantPrc'],
                'floor': article['floorInfo'],
                'building': article['buildingName'],
                'size': article['areaName'],
                'desc': article.get('articleFeatureDesc', '')
            })
        else:
            el[0]['desc'] = el[0]['desc'] + article.get('articleFeatureDesc', '')
    return deduped_data


def size_filter(data, size_list):
    filtered_data = []
    for article in data:
        if article['size'] in size_list:
            filtered_data.append(article)

    return filtered_data


def str_to_num(value):
    arr = value.replace(",", "").replace(" ", "").split("억")

    if arr[1] == "":
        arr[1] = "0"

    return 10000 * int(arr[0]) + int(arr[1])


def pretty_print(config, data):
    print(f"{config['id']}, {config['name']},{data['size']}m2, {data['building']}, {data['floor']}, {money_format(data['price'])}, {data['desc']}")


def money_format(price):
    result = str(math.floor(price / 10000)) + "억"
    result = result + ("" if (price % 10000) == 0 else str((price % 10000)) + "만")
    return result


with open('config.json') as f:
    configs = json.load(f)


def main():
    for config in configs:
        result = size_filter(dedupe(get_data(config['id'])), config['size'])
        sorted_result = sorted(result, key=lambda k: k.get('price', 0), reverse=False)

        print(f"======= {config['name']} =========")
        for article in sorted_result:
            pretty_print(config, article)


main()
