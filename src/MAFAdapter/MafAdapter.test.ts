import { toArray } from 'rxjs/operators'
import MafAdapter from './MafAdapter'
import configSchema from './configSchema'
import fetchMock from 'jest-fetch-mock'

fetchMock.enableMocks()

test('adapter can fetch features from ', async () => {
  const adapter = new MafAdapter(
    configSchema.create({
      mafLocation: {
        localPath: require.resolve('./test_data/maf_test_data.maf'),
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
