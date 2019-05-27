import requests
import json
import pprint
import math
import warnings
from requests.packages.urllib3.exceptions import InsecureRequestWarning


warnings.simplefilter('ignore',InsecureRequestWarning)

def getData(id) :

    moreData = True
    page = 1
    result = []
    while( moreData ):
        url = f"https://new.land.naver.com/api/articles/complex/{id}?tradeType=A1&page={page}"
        response = requests.get(url, verify=False)
        data = json.loads(response.text)        
        result = result + data['articleList']

        if data['isMoreData'] :
            page = page + 1
        else :
            moreData = False    
    return result    

# {
#     key: 'builing + floor + price',
#     price: 
#     floor:
#     building:
#     size:
#     desc: 
# }


def dedupe(data) :
    dedupedData = []
    for article in data:
        key = article['buildingName'] + article['floorInfo'] + article['dealOrWarrantPrc']
        el = [x for x in dedupedData if x['key'] == key]
        if len(el) == 0 :
            dedupedData.append({
                'key': key,
                'price': strToNum(article['dealOrWarrantPrc']),
                'just_price': article['dealOrWarrantPrc'],
                'floor': article['floorInfo'],
                'building': article['buildingName'],
                'size': article['areaName'],
                'desc': article.get('articleFeatureDesc', '')
            })
        else:
            el[0]['desc'] = el[0]['desc'] + article.get('articleFeatureDesc', '')
    return dedupedData

def sizeFilter(data, sizeList) :
    filterdData = []
    for article in data: 
        if article['size'] in sizeList:
            filterdData.append(article)
    
    return filterdData

def strToNum(str):
    arr = str.replace(",","").replace(" ","").split("억")
    
    if arr[1] == "" : 
        arr[1] = "0"

    return 10000 * int(arr[0]) + int(arr[1])
        
def pretty_print(config, data):
    print (f"{config['id']}, {config['name']},{data['size']}m2, {data['building']}, {data['floor']}, {money_format(data['price'])}, {data['desc']} ")

def money_format(price):
    result = str(math.floor(price / 10000)) + "억"
    result = result +  ( "" if (price % 10000) == 0 else str((price % 10000)) + "만")
    return result

with open('config.json') as f:
    configs = json.load(f)

def main(): 
    for config in configs:
        result = sizeFilter(dedupe(getData(config['id'])), config['size'])
        sortedResult = sorted(result,  key=lambda k: k.get('price', 0), reverse=False)

        print( f"======= {config['name']} =========")
        for article in sortedResult:
            pretty_print(config, article)
    
main()
