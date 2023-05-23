export const greySlate = {
  grey01: '#1C2129',
  grey02: '#222530',
  grey03: '#262A37',
  grey04: '#333747',
  grey05: '#44495B',
  grey06: '#5D6379',
  grey07: '#7B8298',
  grey08: '#A1A7BF',
  grey09: '#C2C9E0',
  grey10: '#DBE0F0',
  grey11: '#F6F8FF',
  white: '#F7F8FF',
};

export const blueSlate = {
  actionBlue: '#3683CC',
};

export const fontDetails = {
  fontFamily: 'Roboto, Arial, sans-serif',
  fontSize: '14px',
}

export const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

export const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
}

export const sectionStyle = (sectionWidth: number) => {
  const style: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    width: sectionWidth,
    gap: '20px',
  }
  return style;
}