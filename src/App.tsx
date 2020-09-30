import * as React from "react";
import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";

import "./styles.css";
interface timeZoneProps {}

function FetchTimezones(props: timeZoneProps) {
  const url = "https://worldtimeapi.org/api/timezone/";
  const [timezones, setTimezones] = useState(null);
  const [currTimezone, setCurrTimezone] = useState(null);
  const [currTimeInfo, setCurrTimeInfo] = useState(null);
  const [inputError, toggleInputError] = useState(false);

  fetch(url + "/Europe")
    .then((response) => response.json())
    .then((data) => setTimezones(data));
  const handleSubmit = () => {
    if (currTimezone && timezones.includes(currTimezone))
      fetchTimeData(currTimezone);
    else toggleInputError(true);
  };
  const fetchTimeData = (currTimezone: string) => {
    fetch(url + currTimezone)
      .then((response) => response.json())
      .then((data) => setCurrTimeInfo(data));
  };
  return (
    <Box>
      <Box display="flex">
        {timezones ? (
          <Autocomplete
            id="time-box"
            onChange={(event, newValue) => {
              console.log(newValue);
              toggleInputError(false);
              setCurrTimezone(newValue);
            }}
            value={currTimezone}
            options={timezones}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Available Timezones"
                variant="outlined"
                error={inputError}
              />
            )}
          />
        ) : (
          "Loading Timezones"
        )}
        {timezones ? <Button onClick={handleSubmit}>Submit</Button> : null}
      </Box>
      <TimezoneInfoDisplay {...currTimeInfo} />
    </Box>
  );
}

function TimezoneInfoDisplay(props: any) {
  return (
    <Box display="flex">
      <div>{props.abbreviation} </div>
      <div>{props.datetime}</div>
    </Box>
  );
}

export default function App() {
  return (
    <div className="App">
      <FetchTimezones />
    </div>
  );
}
