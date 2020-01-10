export default {

  session_buckets: [
    {
      expiration_time: 60*60*10,
      spending_limit: '2'
    },
    {
      expiration_time: 60*60*5,
      spending_limit: '4'
    },
    {
      expiration_time: 60*60*3,
      spending_limit: '8'
    }
  ]
}