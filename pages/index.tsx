import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React from "react";
import {
  Box,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
  ButtonGroup,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { InfoTwoTone } from "@mui/icons-material";
const Home: NextPage = ({ data, county, stations, constituency }) => {
  const [prs, setPrs] = React.useState(data);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [err, setError] = React.useState("");
  const [type, setType] = React.useState("county");
  const [count, setCount] = React.useState(47);
  const [_county, setCounty] = React.useState(county);
  const [_constituency, setConst] = React.useState(constituency);
  const [_station, setStation] = React.useState(stations);

  let url1 = "https://static.nation.africa/2022/president.json";
  let url2 = "https://static.nation.africa/2022/county.json";
  let url3 = "https://static.nation.africa/2022/stations.json";
  const url4 = "https://static.nation.africa/2022/constituency.json";
  const link =
    "https://elections.nation.africa/images/candidates/2022/ruto.jpg";

  const filterPayload = (data = [], key = "COUNTY_NO", region = []) => {
    const clean = data.reduce((acc, item) => {
      const county = region.find((reg) => reg[key] === item[key]);
      acc[`group_${item[key]}`] = acc[`group_${item[key]}`] || [];
      item.region = county;
      acc[`group_${item[key]}`].push(item);
      return acc;
    }, {});
    // console.log(clean, "clean");
    return Object.values(clean);
  };
  /**    width: 70px;
    height: 70px;
 */
  const fetchData = async (url, setLoading, setData, setError, type) => {
    try {
      setLoading(true);
      console.log("fetching nation");
      const response = await fetch(url);
      const data = await response.json();
      if (type === "county") {
        const payload = setData(data.county.candidates);
      } else if (type === "constituency") {
        setData(data.constituency.candidates);
      } else {
        setData(data);
      }
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };
  const handleClick = (incomingType: string) => {
    return () => {
      if (incomingType === type) return;
      setType(incomingType);
      if (incomingType === "county")
        fetchData(url1, setLoading, setPrs, setError, "county");
      else if (incomingType === "constituency")
        fetchData(url1, setLoading, setPrs, setError, "constituency");
    };
  };
  const handleSearch = () => {
    let info = null;
    if (search) {
      info = prs.find((item) => item["county"] === search);
      if (info) return setPrs(info);
      info = prs.find((item) => item["constituency"] === search);
      if (info) return setPrs(info);
      return setError("No result found");
    }
  };
  React.useEffect(() => {
    const presurl = "https://static.nation.africa/2022/president.json";
    //fetchData(presurl, setLoading, setPrs, setError, "county");
    //fetchData(url2, setLoading, setCounty, setError, "");
    //fetchData(url4, setLoading, setConst, setError, "");
    //fetchData(url3, setLoading, setStation, setError, "");
    //arrayHashmap(prs);
    filterPayload(prs, "COUNTY_NO", county);
  }, []);

  const memoPRS = React.useMemo(() => {
    let key = type === "county" ? "COUNTY_NO" : "CONSTITUENCY_NO";
    const region = type === "county" ? county : constituency;
    const payload = filterPayload(prs, key, region);
    return payload;
  }, [prs]);
  console.log(memoPRS, "rss");
  return (
    <div className={styles.container}>
      <Head>
        <title>GENERAL ELECTIONS 2022</title>
        <meta name="General Elections 2022" content="KE elections 2022" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={` ${styles.main} flex flex-col sm:flex-row`}>
        <section className="w-3/4 border-red my-4 py-8">
          <Typography className="text-red-400 p-4 text-center">
            General Elections 2022 Results.
          </Typography>
          <Box className="  flex justify-evenly">
            <div>
              <Button
                onClick={handleClick("county")}
                color="primary"
                className={
                  type === "county"
                    ? "bg-blue-500 text-white hover:bg-blue-500"
                    : ""
                }
                variant={type === "county" ? "contained" : "outlined"}
              >
                County
              </Button>
            </div>
            <div>
              <Button
                color="primary"
                onClick={handleClick("constituency")}
                className={
                  type === "constituency"
                    ? "bg-blue-500 text-white hover:bg-blue-500"
                    : ""
                }
                variant={type === "constituency" ? "contained" : "outlined"}
              >
                Constituency
              </Button>
            </div>
            <div>
              <TextField
                type="search"
                size="small"
                placeholder="Search county or constituency"
                onChange={(e) => setSearch(e.target.value)}
                onBlur={handleSearch}
              />

              <Button
                onClick={handleSearch}
                color="primary"
                className="text-white ml-4 bg-blue-500 hover:bg-blue-500"
              >
                Search
              </Button>
            </div>
          </Box>
          <Box className="my-4 py-4">
            {loading ? (
              <Box className="my-auto p-8 text-center">
                <CircularProgress color="primary" size="4rem" />
              </Box>
            ) : (
              memoPRS.length > 0 && (
                <ElectionsTable
                  data={memoPRS}
                  region={type === "county" ? "County" : "Constituency"}
                />
              )
            )}
          </Box>
        </section>
        <section className="w-1/4 border-green"></section>
      </main>

      <footer className={styles.footer}>
        <a> Vince &copy; {new Date().getFullYear()} </a>
      </footer>
    </div>
  );
};

export default Home;

const ElectionsTable = ({ data, region }) => {
  console.log("dada", data);
  const [topLevel] = data;
  let url = "https://elections.nation.africa/images/candidates/2022";
  return (
    <Box>
      <Typography></Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{region}</TableCell>
              <TableCell>
                <div className="flex gap-4 item-center">
                  <div>
                    <img
                      className="w-18 h-10"
                      src={`${url}/${topLevel[0]?.SMALL_IMAGE}`}
                    />
                  </div>
                  <div>
                    {topLevel[0]?.FIRST_NAME} {topLevel[0]?.LAST_NAME}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-4 items-center">
                  <div>
                    <img
                      className="w-18 h-10"
                      src={`${url}/${topLevel[1]?.SMALL_IMAGE}`}
                    />
                  </div>
                  <div>
                    {" "}
                    {topLevel[1]?.FIRST_NAME} {topLevel[1]?.LAST_NAME}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {}
            {data.map((item, i) =>
              region == "county" ? (
                <ElectionTable key={i} i={i} data={item} />
              ) : (
                <ElectionTableConstituency key={i} i={i} data={item} />
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const ElectionTable = ({ data, i }) => {
  return (
    <TableRow key={i}>
      {" "}
      <TableCell>{i + 1}</TableCell>
      <TableCell>{data[0].region.COUNTY_NAME}</TableCell>
      <TableCell>
        {data[0]?.TOTAL_PRESIDENT_COUNTY_VOTES_CAST?.toLocaleString()}{" "}
        <b className="pl-3 ml-4">({Math.ceil(data[0]?.COUNTY_PERCENTAGE)})%</b>
      </TableCell>
      <TableCell>
        {data[1]?.TOTAL_PRESIDENT_COUNTY_VOTES_CAST?.toLocaleString()}
        <b className="pl-3 ml-4">({Math.ceil(data[1]?.COUNTY_PERCENTAGE)})%</b>
      </TableCell>
    </TableRow>
  );
};

const ElectionTableConstituency = ({ data, i }) => {
  return (
    <TableRow key={i}>
      {" "}
      <TableCell>{i + 1}</TableCell>
      <TableCell>{data[0].region?.CONSTITUENCY_NAME}</TableCell>
      <TableCell>
        {data[0]?.CANDIDATE_VOTES?.toLocaleString()}{" "}
        <b className="pl-3 ml-4">
          ({Math.ceil(data[0]?.CONSTITUENCY_PERCENTAGE)})%
        </b>
      </TableCell>
      <TableCell>
        {data[1]?.CANDIDATE_VOTES?.toLocaleString()}
        <b className="pl-3 ml-4">
          ({Math.ceil(data[1]?.CONSTITUENCY_PERCENTAGE)})%
        </b>
      </TableCell>
    </TableRow>
  );
};
//mjoy gal
// 298010
export async function getStaticProps() {
  try {
    console.log("fetching nation");

    let url1 = "https://static.nation.africa/2022/president.json";
    let url2 = "https://static.nation.africa/2022/county.json";
    let url3 = "https://static.nation.africa/2022/stations.json";
    const url4 = "https://static.nation.africa/2022/constituency.json";
    const response = await fetch(url1);
    let res2 = await fetch(url2);
    let res3 = await fetch(url3);
    let res4 = await fetch(url4);

    const [data, county, stations, constituency] = await Promise.all([
      response.json(),
      res2.json(),
      res3.json(),
      res4.json(),
    ]);
    return {
      props: { data: data.county.candidates, county, stations, constituency },
      revalidate: 10,
    };
  } catch (error) {
    console.log(error.message);
    return {
      props: { data: [], county: [], stations: [], constituency: [] },
    };
  }
}
