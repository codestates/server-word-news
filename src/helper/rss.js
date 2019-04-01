const express = require('express');
const jsdom = require('jsdom');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const WordPOS = require('wordpos');
const wordpos = new WordPOS();

const fetchHelper = require('./fetch');

const { JSDOM } = jsdom;

const nytHotRss = 'http://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml'; // nyt rss 기사 가져오려면 fetch파일 수정해야함 http모듈 사용하도록!(https 는 krt);
const krtSportsRss = 'https://www.koreatimes.co.kr/www/rss/sports.xml';
