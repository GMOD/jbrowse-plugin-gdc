import { toArray } from 'rxjs/operators'
import MbvAdapter from './MbvAdapter'
import configSchema from './configSchema'
import fetchMock from 'jest-fetch-mock'
import { firstValueFrom } from 'rxjs'

fetchMock.enableMocks()

test('adapter can fetch features from mbv_test_data.txt', async () => {
  const adapter = new MbvAdapter(
    configSchema.create({
      mbvLocation: {
        localPath: require.resolve('./test_data/mbv_test_data.txt'),
      },
    }),
  )

  const features = adapter.getFeatures({
    assemblyName: 'hg38',
    refName: 'chr3',
    start: 0,
    end: 200000,
  })

  const names = await adapter.getRefNames()
  expect(names).toMatchSnapshot()

  const featuresArray = await firstValueFrom(features.pipe(toArray()))
  const featuresJsonArray = featuresArray.map(f => f.toJSON())
  expect(featuresJsonArray).toMatchSnapshot()
})
