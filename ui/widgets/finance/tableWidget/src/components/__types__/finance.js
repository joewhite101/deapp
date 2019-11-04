import PropTypes from 'prop-types';

const financeType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.number,

    name: PropTypes.string,
  }),
);

export default financeType;
