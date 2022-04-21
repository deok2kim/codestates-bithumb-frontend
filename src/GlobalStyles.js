import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
  ${reset}
  a{
    text-decoration: none;
    color: inherit;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    /* background-color: rgba(20, 20, 20, 1); */
    /* color: white; */
    color: black;
    /* background-color: ; */
    padding-top: 50px;
    min-width: 1200px;
  }
`;

export default GlobalStyles;
