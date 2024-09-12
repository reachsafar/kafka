
//import library
const { Kafka } = require('kafkajs')

// client
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['https://sw-403.onrender'] ,
}) 


// consumer
const consumer = kafka.consumer({ groupId: 'my-group' })//ithe konti req dyaychi

export default async function runConsumer() {
  try {
    //connection
    await consumer.connect()

    // Subscribe 
    await consumer.subscribe({ topic: [/topic-(eu|us)-.*/i] })

    // Run the consumer
    await consumer.run({
      eachBatchAutoResolve: true,
      eachBatch: async ({
        batch,
        resolveOffset,
        heartbeat,
        commitOffsetsIfNecessary,
        uncommittedOffsets,
        isRunning,
        isStale,
        pause,
      }) => {
        for (let message of batch.messages) {
          console.log({
            topic: batch.topic,
            partition: batch.partition,
            highWatermark: batch.highWatermark,
            message: {
              offset: message.offset,
              key: message.key.toString(),
              value: message.value.toString(),
              headers: message.headers,
            }
          })

          resolveOffset(message.offset)
          await heartbeat()
        }
      },
    })
  } catch (error) {
    console.error('Error occurred while running the consumer:', error)
  }
}

// funtion call

