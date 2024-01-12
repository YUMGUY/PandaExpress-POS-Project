/**
 * Translator routes module. This module creates a router that can be used to translate any string of text into a given language.
 * @module translator
 */

const express = require("express");
const { pool } = require("../dbInstance");

/**
 * function to get text in a different language
 * @returns {Object} different methods to view and change the database
 */
const router = express.Router();
const translate = require('@iamtraction/google-translate');

/**
 * Object that maps all available languages to their given language code.
 * @returns {Object} different available languages
 */
const languageCodes = {
  "Afrikaans":	"af",
  "Shqip"	:"sq",
  "عربي":	"ar",
  "Հայերէն":	"hy",
  "آذربایجان دیلی":	"az",
  "Euskara"	:"eu",
  "Беларуская":	"be",
  "Български"	:"bg",
  "Català":	"ca",
  "中文简体":	"zh-CN",
  "中文繁體"	:"zh-TW",
  "Hrvatski"	:"hr",
  "Čeština":	"cs",
  "Dansk"	:"da",
  "Nederlands":	"nl",
  "English":	"en",
  "Eesti keel"	:"et",
  "Filipino"	:"tl",
  "Suomi":	"fi",
  "Français":	"fr",
  "Galego"	:"gl",
  "ქართული":	"ka",
  "Deutsch"	:"de",
  "Ελληνικά":	"el",
  "Kreyòl ayisyen":	"ht",
  "עברית"	:"iw",
  "हिन्दी":	"hi",
  "Magyar"	:"hu",
  "Íslenska":	"is",
  "Bahasa Indonesia":	"id",
  "Gaeilge":	"ga",
  "Italiano"	:"it",
  "日本語"	:"ja",
  "한국어"	:"ko",
  "Latviešu":	"lv",
  "Lietuvių kalba":	"lt",
  "Македонски"	:"mk",
  "Malay":	"ms",
  "Malti"	:"mt",
  "Norsk"	:"no",
  "فارسی"	:"fa",
  "Polski":	"pl",
  "Português":	"pt",
  "Română":	"ro",
  "Русский"	:"ru",
  "Српски"	:"sr",
  "Slovenčina":	"sk",
  "Slovensko":	"sl",
  "Español"	:"es",
  "Kiswahili":	"sw",
  "Svenska":	"sv",
  "ไทย":	"th",
  "Türkçe"	:"tr",
  "Українська"	:"uk",
  "اردو"	:"ur",
  "Tiếng Việt"	:"vi",
  "Cymraeg"	:"cy",
  "ייִדיש"	:"yi",
}

/**
 * function to calculate the revenue within a given time period
 * @param {list} screenText - a list of all strings wanted to be translated
 * @param {string} lang - a string of the name of the language you wish to translate the text to
 * @returns {Object} An object with each string translated to a new language.
 */
router.get("/translateText", async(req, res) => {
    const screenText = req.query.screenText;
    const lang = req.query.language;

    const returnText = {};
    
    screenText.forEach(async (t) => {
      translate(t, { from: 'en', to: languageCodes[lang] }).then(result => {
        returnText[t] = result.text;

        if(Object.keys(returnText).length == screenText.length){
          res.status(200).json(returnText);
        }

      }).catch(err => {
        console.error(err);
      });
    })

    // res.status(200).json(returnText);
    
});


module.exports = router;