
/*
 * Matrix used by the engine
 *
 *
 */

var Matrix={
    I4:[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
    I3:[1,0,0, 0,1,0, 0,0,1],
    pMatrix: false,
    pMatrixInv: false,
    stack:[],

    mvPushMatrix: function() {
        this.stack.push(lib_matrix_base4.copyNew(this.mvMatrix));
    },

    mvPopMatrix: function() {
        this.stack.pop();
    },

    loadIdentity: function() {
      this.mvMatrix[0]=1;this.mvMatrix[1]=0;this.mvMatrix[2]=0;this.mvMatrix[3]=0;
      this.mvMatrix[4]=0;this.mvMatrix[5]=1;this.mvMatrix[6]=0;this.mvMatrix[7]=0;
      this.mvMatrix[8]=0;this.mvMatrix[9]=0;this.mvMatrix[10]=1;this.mvMatrix[11]=0;
      this.mvMatrix[12]=0;this.mvMatrix[13]=0;this.mvMatrix[14]=0;this.mvMatrix[15]=1
    },

    loadMvMatrix: function(m) {
      this.mvMatrix[0]=m[0];this.mvMatrix[1]=m[1];this.mvMatrix[2]=m[2];this.mvMatrix[3]=m[3];
      this.mvMatrix[4]=m[4];this.mvMatrix[5]=m[5];this.mvMatrix[6]=m[6];this.mvMatrix[7]=m[7];
      this.mvMatrix[8]=m[8];this.mvMatrix[9]=m[9];this.mvMatrix[10]=m[10];this.mvMatrix[11]=m[11];
      this.mvMatrix[12]=m[12];this.mvMatrix[13]=m[13];this.mvMatrix[14]=m[14];
    },

    loadNMatrix: function(m) {
     // this.nMatrix[0]=m[0]; this.nMatrix[1]=m[4]; this.nMatrix[2]=m[8];
     // this.nMatrix[3]=m[1]; this.nMatrix[4]=m[5]; this.nMatrix[5]=m[9];
     // this.nMatrix[6]=m[2]; this.nMatrix[7]=m[6]; this.nMatrix[8]=m[10];
      this.nMatrix[0]=m[0]; this.nMatrix[1]=m[1]; this.nMatrix[2]=m[2];
      this.nMatrix[3]=m[4]; this.nMatrix[4]=m[5]; this.nMatrix[5]=m[6];
      this.nMatrix[6]=m[8]; this.nMatrix[7]=m[9]; this.nMatrix[8]=m[10];

    },

    mvUniform: function() {
        GL.uniformMatrix4fv(SHADER_PROGRAM.mvMatrixUniform, false, this.stack[0]);
    },

    vUniform: function()  {
        GL.uniformMatrix4fv(SHADER_PROGRAM.V_Matrix, false, this.mvMatrix);
    },

    nUniform: function() {       
        GL.uniformMatrix3fv(SHADER_PROGRAM.nMatrixUniform, false, this.nMatrix);
    },

    pUniform: function() {
        GL.uniformMatrix4fv(SHADER_PROGRAM.pMatrixUniform, false, this.pMatrix);
    },

    set_pMatrix: function(pMatrix) {
        this.pMatrix=pMatrix;
        this.pUniform();
    },

    setPMatrix: function(fovy, aspect, znear, zfar) {
        this.pMatrix = lib_matrix_proj.makePerspectiveNew(fovy, aspect, znear, zfar);
        this.pMatrixInv=lib_matrix_base.invertNew(this.pMatrix,4);
        this.pick_a=2/CONTEXT3D.width;
        this.pick_b=-2/CONTEXT3D.height;
    },

    init: function() {
        this.mvMatrix=lib_matrix_base4.getI4();
        this.nMatrix=lib_matrix_base3.get_I3();
    },

    pickVector: function(vect2D) {
        return [vect2D[0]*this.pMatrixInv[0],
                vect2D[1]*this.pMatrixInv[5],
                -1];        
    }

}
Matrix.init();

