import { supabase } from './supabase';

export default {
  // Obtener los puntajes del usuario
  async getUserScores(userId) {
    try {
      const { data, error } = await supabase
        .from('user_icfes_scores')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      // Si no hay datos, devolver null
      if (!data) return null;

      // Retornar solo los campos de puntuación
      const { id, user_id, created_at, updated_at, ...scores } = data;
      return scores;
    } catch (error) {
      console.error('Error al obtener puntajes ICFES:', error);
      throw error;
    }
  },

  // Guardar o actualizar puntajes
  async saveScores(userId, scores) {
    try {
      // Primero, verificar si ya existen puntajes para este usuario
      const { data: existingScores } = await supabase
        .from('user_icfes_scores')
        .select('id')
        .eq('user_id', userId)
        .single();

      const scoreData = {
        user_id: userId,
        ...scores,
        updated_at: new Date().toISOString(),
      };

      let data, error;

      if (existingScores) {
        // Actualizar registro existente
        const { data: updateData, error: updateError } = await supabase
          .from('user_icfes_scores')
          .update(scoreData)
          .eq('user_id', userId)
          .select()
          .single();
        
        data = updateData;
        error = updateError;
      } else {
        // Crear nuevo registro
        const { data: insertData, error: insertError } = await supabase
          .from('user_icfes_scores')
          .insert(scoreData)
          .select()
          .single();
        
        data = insertData;
        error = insertError;
      }

      if (error) throw error;

      // Retornar solo los campos de puntuación
      const { id, user_id, created_at, updated_at, ...updatedScores } = data;
      return updatedScores;
    } catch (error) {
      console.error('Error al guardar puntajes ICFES:', error);
      throw error;
    }
  },

  // Eliminar puntajes
  async deleteScores(userId) {
    try {
      const { error } = await supabase
        .from('user_icfes_scores')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar puntajes ICFES:', error);
      throw error;
    }
  },
};
