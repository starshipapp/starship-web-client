function fixPFP(url: string): string {
  if(url.startsWith("https://") || url.startsWith("http://")) {
    return url;
  } else {
    if(process.env.REACT_APP_GRAPHQL_ENDPOINT?.startsWith("https://")) {
      return "https://" + url;
    } else {
      return "http://" + url;
    }
  }
}

export default fixPFP;