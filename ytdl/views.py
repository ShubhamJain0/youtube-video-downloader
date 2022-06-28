from __future__ import unicode_literals
from django.shortcuts import render
from django.http import HttpResponse

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec

from yt_dlp import YoutubeDL

# Create your views here.

def Home(request):
    return render(request, 'index.html')


def DownloadFromChannel(request):
    link_input = request.POST.get('link', None)
    no_of_videos_to_download = 0
    start_number = int(request.POST.get('start_range', None))
    end_number = int(request.POST.get('end_range', None))
    if start_number == 0 or end_number == 0:
        no_of_videos_to_download = request.POST.get('videos_count', None)
    links_list = []

    #Invalid link
    if '/channel/' not in link_input and '/c/' not in link_input:
        return HttpResponse(status=400)

    if not link_input.endswith('/videos'):
        link_input += '/videos'

    #webdriver config
    options = ChromeOptions()
    options.add_experimental_option("detach", True)
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    options.add_argument("--start-maximized")
    options.add_argument("--headless")
    driver = webdriver.Remote('http://selenium:4444/wd/hub', options=options)
    driver.get(link_input)

    get_results = WebDriverWait(driver, 15).until(ec.presence_of_all_elements_located((By.CSS_SELECTOR, '#contents #contents.ytd-item-section-renderer .ytd-item-section-renderer #items .ytd-grid-renderer #dismissible #details.ytd-grid-video-renderer #meta h3 a')))
    
    #scrolls down and collects links
    while True:
        # Scroll down to last name in list
        driver.execute_script('arguments[0].scrollIntoView();', get_results[-1])
        try:
            # Wait for more names to be loaded
            WebDriverWait(driver, 15).until(lambda driver: len(WebDriverWait(driver, 15).until(ec.presence_of_all_elements_located((By.CSS_SELECTOR, '#contents #contents.ytd-item-section-renderer .ytd-item-section-renderer #items .ytd-grid-renderer #dismissible #details.ytd-grid-video-renderer #meta h3 a')))) > len(get_results))
            # Update list 
            get_results = WebDriverWait(driver, 15).until(ec.presence_of_all_elements_located((By.CSS_SELECTOR, '#contents #contents.ytd-item-section-renderer .ytd-item-section-renderer #items .ytd-grid-renderer #dismissible #details.ytd-grid-video-renderer #meta h3 a')))
            if (str(len(get_results)) > str(no_of_videos_to_download) and len(get_results) > end_number) and not no_of_videos_to_download == 'All':
                break
        except:
            # Break the loop in case no new names loaded after page scrolled down
            break



    #get urls of videos
    if no_of_videos_to_download == 'All':
        for i in range(0, len(get_results)):
            WebDriverWait(driver, 20)
            links_list.append(get_results[i].get_attribute('href'))
    elif start_number == 0 or end_number == 0:
        for i in range(0, int(no_of_videos_to_download)):
            links_list.append(get_results[i].get_attribute('href'))
    else:
        if(end_number > len(get_results)):
            end_number = len(get_results)
        for i in range(start_number - 1, end_number):
            links_list.append(get_results[i].get_attribute('href'))



    #close browser
    driver.close()
    driver.quit()



    for i in range(0, len(links_list)):
        ydl_opts = {'format': 'best[ext=mp4]', 'outtmpl': '%(channel)s/%(title)s.%(ext)s'}
        with YoutubeDL(ydl_opts) as ydl:
            result = ydl.download(links_list[i])

    return HttpResponse("Downloading")


def DownloadSingleVideo(request):
    video_link = request.POST.get("video_link", None)
    if video_link is not None:
        ydl_opts = {'format': 'best[ext=mp4]', 'outtmpl': '%(channel)s/%(title)s.%(ext)s'}
        with YoutubeDL(ydl_opts) as ydl:
            result = ydl.download(video_link) 
    return HttpResponse("Downloaded")