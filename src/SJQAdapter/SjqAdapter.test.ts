import { toArray } from 'rxjs/operators'
import SjqAdapter from './SjqAdapter'
import configSchema from './configSchema'
import fetchMock from 'jest-fetch-mock'
import { firstValueFrom } from 'rxjs'

fetchMock.enableMocks()

test('adapter can fetch features from sjq_test_data.txt', async () => {
  const adapter = new SjqAdapter(
    configSchema.create({
      sjqLocation: {
        localPath: require.resolve('./test_data/sjq_test_data.txt'),
      },
    }),
  )

  const features = adapter.getFeatures({
    assemblyName: 'volvox',
    refName: 'chr9',
    start: 94175962,
    end: 94175981,
  })

  const names = await adapter.getRefNames()
  expect(names).toMatchSnapshot()

  const featuresArray = await firstValueFrom(features.pipe(toArray()))
  const featuresJsonArray = featuresArray.map(f => f.toJSON())
  expect(featuresJsonArray).toMatchSnapshot()
})
