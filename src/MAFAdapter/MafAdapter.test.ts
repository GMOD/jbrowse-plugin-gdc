import { toArray } from 'rxjs/operators'
import MafAdapter from './MafAdapter'
import configSchema from './configSchema'
import fetchMock from 'jest-fetch-mock'
import { firstValueFrom } from 'rxjs'

fetchMock.enableMocks()

test('adapter can fetch features from maf_test_data.maf', async () => {
  const adapter = new MafAdapter(
    configSchema.create({
      mafLocation: {
        localPath: require.resolve('./test_data/maf_test_data.maf'),
      },
    }),
  )

  const features = adapter.getFeatures({
    assemblyName: 'volvox',
    refName: 'chr2',
    start: 0,
    end: 235551314,
  })

  const names = await adapter.getRefNames()
  expect(names).toMatchSnapshot()

  const featuresArray = await firstValueFrom(features.pipe(toArray()))
  const featuresJsonArray = featuresArray.map(f => f.toJSON())
  expect(featuresJsonArray).toMatchSnapshot()
})
