import KongLib from 'node-kong-admin'

export async function KongRegister(KongOption) {
  // 注册接口网关
  console.log('注册接口网关')
  const KongClient = new KongLib({
    url: KongOption['KongHOST']
  });
  try {
    await KongClient.upstream.get(KongOption.upstream.name, async (err, done) => {
      console.log('Done', done);
      if (done) {
        await KongClient.upstream.delete(KongOption.upstream.name, async (err, done) => {
          console.log('deleteUpstream:', KongOption.upstream.name);
          if (err) throw new Error(JSON.stringify(err));
          console.log('Delete Upstream: ', done);
          await KongClient.route.get(KongOption.route.name, async (err, done) => {
            if (done) {
              await KongClient.route.delete(KongOption.route.name, async (err, done) => {
                console.log('deleteRoute:', KongOption.route.name);
                if (err) throw new Error(JSON.stringify(err));
                console.log('Delete Route: ', done);
                await KongClient.service.get(KongOption.service.name, async (err, done) => {
                  if (done) {
                    await KongClient.service.delete(KongOption.service.name, async (err, done) => {
                      console.log('deleteService:', KongOption.service.name);
                      if (err) throw new Error(JSON.stringify(err));
                      console.log('Delete Service: ', done);
                      await createKong()
                    })
                  }
                })
              })
            }
          })
        })
      } else {
        // 创建网关
        await createKong()
      }
    })
  } catch (e) {
    console.log(e);
  }

  async function createKong() {
    console.log('KongOption.upstream Params:', KongOption.upstream);
    await KongClient.upstream.create(KongOption.upstream, async (err, done) => {
      console.log('kong-upstream-params:', KongOption.upstream);
      if (err) throw new Error(JSON.stringify(err));
      console.log('Upstream Created: ', done);
      if (done) {
        console.log(done.id);
        KongOption.target.upstream = done.id
        KongClient.target.create(KongOption.target, (err, done) => {
          console.log('kong-target-params:', KongOption.target);
          if (err) throw new Error(JSON.stringify(err));
          console.log('target Created: ', done);
          if (done) {
            KongClient.service.create(KongOption.service, (err, done) => {
              console.log('kong-service-params:', KongOption.service);
              if (err) throw new Error(JSON.stringify(err));
              console.log('service Created: ', done);
              if (done) {
                KongOption.route.service.id = done.id

                KongClient.route.create(KongOption.route, (err, done) => {
                  console.log('kong-route-params:', KongOption.route);
                  if (err) throw new Error(JSON.stringify(err));
                  console.log('route Created: ', done);
                  console.log('Kong 注册成功')
                })
              }
            });
          }
        })
      }
    })
  }
}


