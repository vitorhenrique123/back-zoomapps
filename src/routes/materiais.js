const db = require("../config/database");

const listarCadernos = (req, res) => {
    const { email, id } = req.query;

    let cmd = `
        SELECT * FROM public.cadernos
        WHERE public.cadernos.email = $1
    `
    if(id) {
        cmd += `
            and public.cadernos.id = $2
        `
        db.pool.query(cmd, [email, id], (err, result) => {
            res.status(200).send(result.rows);
        });
    } else {
        db.pool.query(cmd, [email], (err, result) => {
            res.status(200).send(result.rows);
        });
    }

}


const criarCaderno = (req, res) => {
    const {
        email, nome, texto
    } = req.body

    db.pool.query(`
        INSERT INTO public.cadernos (texto, email, nome)
        VALUES ($1, $2, $3)
    `, [texto, email, nome], (err, result) => {
        
        res.status(201).end();
    });
}


const atualizarCaderno = (req, res) => {
    const {
        email, texto, nome, id
    } = req.body;
    db.pool.query(`
        UPDATE public.cadernos
        SET
            texto = $1,
            nome = $2
        WHERE 
            email = $3 and
            id = $4
    `, [texto, nome, email, id], (err, result) => {
        console.log(err);
        console.log(result);
        res.status(200).send({
            email, texto, nome, id
        });
    });

}

const excluirCaderno = async (req, res) => {
    const {
        email, id
    } = req.query

    const result = await db.pool.query(`
        DELETE FROM public.cadernos
        WHERE
            id = $1 and
            email = $2
    `, [id, email]);

    res.status(204).end();
}

const listarImagens = async (req, res) => {
    const { email } = req.query;

    const result = await db.pool.query(`
        SELECT * FROM public.galeria 
        INNER JOIN public.usuarios ON public.usuarios.email = public.galeria.email 
        WHERE public.usuarios.email = $1
    `, [email]);

    res.status(200).send(result.rows);
}


const adicionarImagem = async (req, res) => {
    const {
        email, image_base64
    } = req.body

    const result = await db.pool.query(`
        INSERT INTO public.galeria (email, image_base64)
        VALUES ($1, $2)
    `, [email, image_base64]);

    res.status(201).end();
}

const excluirImagem = async (req, res) => {
    const {
        email, id
    } = req.query

    const result = await db.pool.query(`
        DELETE FROM public.galeria
        WHERE
            id = $1 and
            email = $2
    `, [id, email]);

    res.status(204).end();
}



const listarArquivos = async (req, res) => {
    const { email } = req.query;

    const result = await db.pool.query(`
        SELECT * FROM public.material_apoio 
        INNER JOIN public.usuarios ON public.usuarios.email = public.material_apoio.email 
        WHERE public.usuarios.email = $1
    `, [email]);

    res.status(200).send(result.rows);
}


const adicionarArquivo = async (req, res) => {
    const {
        email, file_name, file_extension, file_base64
    } = req.body

    const result = await db.pool.query(`
        INSERT INTO public.material_apoio (email, file_name, file_extension, file_base64)
        VALUES ($1, $2, $3, $4)
    `, [email, file_name, file_extension, file_base64]);

    res.status(201).end();
}

const excluirArquivo = async (req, res) => {
    const {
        email, id
    } = req.query

    const result = await db.pool.query(`
        DELETE FROM public.material_apoio
        WHERE
            id = $1 and
            email = $2
    `, [id, email]);

    res.status(204).end();
}


module.exports = {
    listarCadernos,
    criarCaderno,
    atualizarCaderno,
    excluirCaderno,
    listarImagens,
    adicionarImagem,
    excluirImagem,
    listarArquivos,
    adicionarArquivo,
    excluirArquivo
}