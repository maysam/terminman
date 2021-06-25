import React, { useState, useEffect } from "react";
import moment from "moment";
import Logo from "./logo.svg";

function Termin({ setEditMode }) {
  const [termins, setTermins] = useState();
  const [dif, setDif] = useState();

  useEffect(() => {
    var loadTermins = localStorage.getItem("termins") || "[]";
    if (loadTermins) {
      setTermins(
        JSON.parse(loadTermins).sort(function (a, b) {
          let start = moment(a.datetime);
          let end = moment(b.datetime);

          if (moment.duration(end.diff(start)).asSeconds() > 0) {
            return -1;
          }
          return 1;
        })
      );
    }
  }, []);

  function findCurrentTermin() {
    if (termins) {
      for (let i = 0; i < termins.length; i++) {
        if (
          termins[i].active &&
          moment(termins[i].datetime).isAfter(moment())
        ) {
          return {
            id: termins[i].tableData.id,
            datetime: moment(termins[i].datetime),
            time: moment(termins[i].datetime).format("DD.MM.YYYY - HH:mm"),
            event: termins[i].event,
            active: termins[i].active,
          };
        }
      }
      setTimeout(() => {
        setEditMode(true);
      }, 20000);
    }
  }
  const currentTermin = findCurrentTermin();

  const getCountDownTo = () => {
    if (currentTermin) {
      // calculate details
      let start = moment(new Date());
      let end = moment(currentTermin.datetime);
      var dif = end.diff(start, "seconds");
      setDif(dif);
    }
  };

  useEffect(() => {
    var timer = setInterval(() => getCountDownTo(), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  if (!termins) {
    return <div>Loading...</div>;
  }

  if (!currentTermin || !dif) {
    return (
      <div className=" box-border min-w-1/4 min-h-1/4 align-middle text-center border-4 border-green-900 pt-8 m-20 text-3xl">
        No more entries in the list, will be redirected to termin page in 20
        seconds
        <button
          className="text-2xl border-4 rounded-lg border-green-600 ring-4 ring-pink-300 m-20 p-2"
          onClick={() => setEditMode(true)}
        >
          Go to the Edit Events
        </button>
      </div>
    );
  }

  let pageMode = "bg-black";

  if (dif < 600) pageMode = "bg-yellow-400";
  if (dif < 300) pageMode = "bg-red-600";
  if (dif < 120) pageMode = dif % 2 === 1 ? "bg-yellow-400" : "bg-red-600";

  const seconds = dif % 60
  const secondString = `${seconds}`.padStart(2, '0')

  const minutes = ((dif - seconds) / 60) % 60
  const minuteString = `${minutes}`.padStart(2, '0')

  const hours = (dif - seconds - minutes * 60) / 3600
  const hourString = `${hours < 99 ? hours : 99}`.padStart(2, '0')

  // const leftTime = new Date(dif * 1000).toISOString().substr(11, 8);
  const timeLeft = `${hourString}:${minuteString}:${secondString}`

  return (
    <div
      className={`h-screen flex flex-col justify-between text-white w-full max-h-full ${pageMode}`}
    >
      <div className="flex flex-row justify-between bg-black  ">
        <div className="border border-gray-400 p-2 m-2 text-md">
          {moment().format("DD.MM.YYYY")}
        </div>
        <div className="border border-gray-400 p-2 m-2 text-md">
          {moment().format("HH:mm:ss")}
        </div>
      </div>
      <div className="text-5xl text-center font-bold bg-black">
        {currentTermin.time}
        {' - '}
        {currentTermin.event}
      </div>
      <div
        className="text-9xl border-2 font-bold text-center ml-2 mr-2  bg-black"
        style={{ fontSize: "50px" }}
      >
        {timeLeft}
      </div>
      <div className="flex justify-center">
        <img src={Logo} alt="Logo" className="w-1/2 bg-white" />
      </div>
      <div className="flex  bg-black">
        <div
          className="border border-gray-400 bg-blue-900 text-lg text-blue-300 m-2 p-2 cursor-pointer"
          onClick={() => setEditMode(true)}
        >
          Edit Events
        </div>
      </div>
    </div>
  );
}

export default Termin;
