const SectionDivider = ({ style }) => (
  <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '1px', ...style }}>
    <div style={{ flex: 1, height: 0, borderBottom: '1px solid #EAEAEA' }} />    
  </div>
);

export default SectionDivider;
