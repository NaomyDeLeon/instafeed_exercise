const cluster = require('cluster');
const { cpus } = require('os');
const server = require('./server');

try {
    const numCPUs = cpus().length;
    if (cluster.isMaster) {
        console.log(`Primary ${process.pid} is running`);
        for (let i = 0; i < numCPUs; i += 1) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(
                `worker ${worker.process.pid} died ${code} - ${signal}`
            );
        });
    } else {
        console.log('iniciado1');
        server.db
            .run()
            .then(() =>
                server.app.listen(server.config.port, () =>
                    console.log('iniciado')
                )
            )
            .catch((err) => console.error(err));
        console.log(`Worker ${process.pid} started`);
    }
} catch (err) {
    console.error(err);
}
