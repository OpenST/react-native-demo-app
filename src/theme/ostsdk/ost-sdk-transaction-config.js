export default {
  session_buckets: [
    {
      expiration_time: 60*60*24*30*2, //2 months
      spending_limit: '10'
    },
    {
      expiration_time: 60*60*24*30, //1 months
      spending_limit: '50'
    },
    {
      expiration_time: 60*60*24, //24 hours
      spending_limit: '100'
    },
    {
      expiration_time: 60*60*1, //1 hours
      spending_limit: '100000'
    }
  ]
}