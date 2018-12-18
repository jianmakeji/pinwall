/* jshint indent: 2 */

module.exports = app => {

  const {
    BOOLEAN,
    INTEGER,
    DATE,
    TEXT
  } = app.Sequelize;

  const ArtifactComments = app.model.define('artifact_comments', {
    Id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    artifactId: {
      type: INTEGER,
      allowNull: true
    },
    commenterId: {
      type: INTEGER,
      allowNull: true
    },
    content: {
      type: TEXT,
      allowNull: true
    },
    commentAt: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    visible: {
      type: BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'artifact_comments'
  });

  ArtifactComments.listComments = async function ({ offset = 0, limit = 10}) {
    return await this.findAndCountAll({
      offset,
      limit,
      order: [[ 'commentAt', 'desc' ]],
    });
  }

  ArtifactComments.findByArtifactIdWithPage = async function ({
    offset = 0,
    limit = 10,
    artifactId = 0
  }) {
    return await this.findAndCountAll({
      offset,
      limit,
      order: [
        ['createAt', 'desc'],
        ['Id', 'desc']
      ],
      where: {
        artifactId: artifactId
      }
    });
  }

  ArtifactComments.createComment = async function (artifactComments) {
    return await this.create(artifactComments);
  }

  ArtifactComments.setVisible = async function ({
    Id = 0,
    visible = 0
  }) {
    return await this.update({
      visible: visible
    }, {
      where: {
        Id: Id
      }
    });
  }

  ArtifactComments.delCommentById = async function (Id) {
    const artifact = await this.findById(Id);
    if (!artifact) {
      throw new Error('artifact not found');
    }
    return artifact.destroy();
  }

  ArtifactComments.delCommentByArtifactId = async function (artifactId) {
    return this.destroy({
      where : {
        artifactId:artifactId
      }
    });
  }

  ArtifactComments.delCommentByCommenterId = async function (commenterId) {
    return this.destroy({
      where : {
        commenterId:commenterId
      }
    });
  }

  return ArtifactComments;
};
