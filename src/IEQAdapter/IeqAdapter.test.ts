import { toArray } from 'rxjs/operators'
import IeqAdapter from './IeqAdapter'
import configSchema from './configSchema'
import fetchMock from 'jest-fetch-mock'

fetchMock.enableMocks()

test('adapter can fetch features from ieq_test_data.txt', async () => {
  const adapter = new IeqAdapter(
    configSchema.create({
      ieqLocation: {
        localPath: require.resolve('./test_data/ieq_test_data.txt'),
      },
    }),
  )

  const features = adapter.getFeatures({
    assemblyName: 'volvox',
    refName: '3',
    start: 0,
    end: 200000,
  })

  const names = await adapter.getRefNames()
  expect(names).toMatchSnapshot()

  const featuresArray = await features.pipe(toArray()).toPromise()
  const featuresJsonArray = featuresArray.map(f => f.toJSON())
  expect(featuresJsonArray).toMatchSnapshot()
})
