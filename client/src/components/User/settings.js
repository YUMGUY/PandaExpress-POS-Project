/**
 * A module that creates a React Component for all the different settings a user can adjust.
 * @module Settings
 */

import { Button, Spinner, Form, Table,} from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * A function that creates and organizes a React Component that allows a user to change the language of the entire application.
 * @param {Object} props - decoded user payload information
 * @returns {Object} - the html for the React Component
 */
function Settings(props) {

  const [isLoading, setLoading] = useState(true);
  const [isLoading2, setLoading2] = useState(true);
  const [language, setLanguage] = useState("English");
  const [tts, setTTS] = useState(false);
  const [screenText, setScreenText] = useState({});

  useEffect(() => {
    setScreenText(props.auth.user.screenText);
    axios.get("/users/getUserSettings", {
      params: {
        userID: props.auth.user.id
      }
    }).then((res) => {
      if(res.data.language){
        setLanguage(res.data.language);
        setTTS(res.data.tts);
      }
      setLoading(false);
      if(localStorage.getItem("translation") != null && localStorage.getItem("currentLanguage") != null && localStorage.getItem("currentLanguage") === res.data.language){
        setScreenText(JSON.parse(localStorage.getItem("translation")));
        setLoading2(false);
      }
      else{
        translateText(res.data.language);
      }
    })
    .catch((err) => console.log(err));

  }, []);

  const saveChanges = () => {
    axios.post("/users/saveSettings", {
      params: {
        userID: props.auth.user.id,
        language: language,
        tts: tts,
      }
    })
    .then((res) => {
      if(res.status === 200){
        window.location.reload();
      }
    })
  }

  const translateText = async (lang) => {
    console.log("translating");
    axios.get("/translator/translateText", {
      params: {
        screenText: Object.keys(props.auth.user.screenText),
        language: lang,
      }
    }).then((res) => {
      const translationData = res.data;

      localStorage.setItem("currentLanguage", lang);
      localStorage.setItem("translation", JSON.stringify(translationData) );
      setScreenText(res.data);
      window.location.reload();
      setLoading2(false);
    })
    
  }

  const mapLanguageOptions = () => {
    const languageCodes = ['Afrikaans', 'Shqip', 'عربي', 'Հայերէն', 'آذربایجان دیلی', 'Euskara', 'Беларуская', 'Български', 'Català', '中文简体', '中文繁體', 'Hrvatski', 'Čeština', 'Dansk', 'Nederlands', 'English', 'Eesti keel', 'Filipino', 'Suomi', 'Français', 'Galego', 'ქართული', 'Deutsch', 'Ελληνικά', 'Kreyòl ayisyen', 'עברית', 'हिन्दी', 'Magyar', 'Íslenska', 'Bahasa Indonesia', 'Gaeilge', 'Italiano', '日本語', '한국어', 'Latviešu', 'Lietuvių kalba', 'Македонски', 'Malay', 'Malti', 'Norsk', 'فارسی', 'Polski', 'Português', 'Română', 'Русский', 'Српски', 'Slovenčina', 'Slovensko', 'Español', 'Kiswahili', 'Svenska', 'ไทย', 'Türkçe', 'Українська', 'اردو', 'Tiếng Việt', 'Cymraeg', 'ייִדיש'].sort();
    const list = [];
    languageCodes.forEach((lang) => {
      let temp = <option>{lang}</option>
      list.push(temp);
    })
    return list;
  }

  return (
  
      <div className="FindStore">
        {isLoading || isLoading2 ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <React.Fragment>
            
            <Table striped bordered hover className="text-center">
              <thead>
                <td colSpan={2}><h2 className="display-3 text-center">{screenText["My Settings"]}</h2></td>
              </thead>
              <tbody>
                <tr>
                <td class="col-md-4"><p>{screenText["Language"]}</p></td>
                <td class="col-md-4" className="align-items-center">
                  <Form.Group className="mb-2">
                    <Form.Select
                      aria-label="Language"
                      value={language}
                      width="300"
                      onChange={(e) => {
                      setLanguage(e.target.value);
                      }}
                      style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}
                      >
                        {mapLanguageOptions()}
                        {/* <option>English</option>
                        <option>Spanish</option>
                        <option>Dutch</option> */}
                    </Form.Select>
                  </Form.Group>
                </td>
                </tr>
                {/* <tr>
                  <td class="col-md-4"><p>{screenText["Text-to-Speech"]}</p></td>
                  <td class="col-md-4">
                      <BootstrapSwitchButton
                          checked={tts}
                          onlabel={screenText["Disable Text-to-Speech"]}
                          offlabel={screenText["Enable Text-to-Speech"]}
                          width="300"
                          onChange={() => setTTS(!tts)}
                      />
                  </td>
                </tr> */}
              </tbody>
            </Table>
            <br></br><br></br><br></br><br></br>
            <div className="d-flex justify-content-center">
              <Button className="btn-lg btn-success" onClick={() => saveChanges()}>{screenText["Save Changes!"]}</Button>
            </div>
            <br></br>
          </React.Fragment>
      )
    }
    </div>
    );


}

Settings.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Settings);