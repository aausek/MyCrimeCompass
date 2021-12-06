import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
position: absolute;
top: 60%;
left: 50%;
width: 35px;
height: 35px;
background-color: red;
border: 2px solid #fff;
border-radius: 100%;
user-select: none;
transform: translate(-50%, -50%);
&:hover {
  z-index: 1;
  }
`;

// const Marker = ({text}) => (
//   <Wrapper
//     text={text}
//   />
// );

const Marker = ({ text, tooltip }) => (
  <Wrapper>
    <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop : '7px'}} title={tooltip}>
      {text}
    </span>
  </Wrapper>
);

Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default Marker;