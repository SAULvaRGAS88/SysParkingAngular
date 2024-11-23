/**Retorna a hora atual para todo sistema */
export const Recuperahorario = () => {
    const data = new Date();
    return data.toLocaleTimeString();
};

/**Retorna a data atual para todo sistema */
export const Recuperadata = () => {
    const data = new Date();
    return data.toLocaleDateString();
};
